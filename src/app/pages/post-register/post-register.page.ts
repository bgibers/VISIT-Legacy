import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, take } from 'rxjs/operators';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

import { LoggedInUser } from 'src/app/backend/client/model/loggedInUser';
import { Map } from '../../objects/map';
import { UserService, UserLocationService, JwtToken, UserLocation } from 'src/app/backend/client';
import { MapSelectionMode } from '../../objects/enums/map-selection-mode';
import { LocationSelector } from 'src/app/objects/location.selector';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'post-register',
  templateUrl: './post-register.page.html',
  styleUrls: ['./post-register.page.scss']
})
export class PostRegisterPage implements OnInit {
  private jwtToken: JwtToken = {} as JwtToken;
  public user: LoggedInUser = {} as LoggedInUser;
  public profilePic = '../../../assets/defaultuser.png';
  private loading: any;
  private visitedMap: Map;
  private toVisitMap: Map;
  public searchOptions: Array<any>;
  public canRegister = false;
  public searchCtrl: FormControl = new FormControl();
  public searchFilterCtrl: FormControl = new FormControl();
  public searchValue: string;

  constructor(
    private userService: UserService,
    private router: Router,
    private zone: NgZone,
    private camera: Camera,
    private file: File,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    private selector: LocationSelector,
    private userLocationService: UserLocationService
  ) {
    this.visitedMap = new Map(zone);
    this.toVisitMap = new Map(zone);

    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.username = this.router.getCurrentNavigation().extras.state.newUser;
    //   }
    // });
  }
  ngOnInit(): void {
    this.searchOptions = this.selector.getAllLocations();
    this.searchFilterCtrl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filterSearch(value))
    )
  }

  public _filterSearch(value: string) {
    const filterValue = value.toLowerCase();
    return this.searchOptions.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  public zoomToLocation(mapType: string) {
    if (mapType === 'visited') {
      this.visitedMap.zoomToLocation(this.searchValue);
    } else {
      this.toVisitMap.zoomToLocation(this.searchValue);
    }
  }

  async ionViewWillEnter() {
    await this.presentLoading();
    await this.visitedMap.createMap('visitedMap', MapSelectionMode.VISITED);
    await this.toVisitMap.createMap('toVisitMap', MapSelectionMode.TO_VISIT);
    this.userService
      .userGetCurrentUser()
      .pipe(
        finalize(async () => {
          await this.userService.getUserToken().then(async token => {
            this.jwtToken = token;
            await this.loading.dismiss();
          });
        }),
        take(1)
      )
      .subscribe(res => {
        this.user = res;
      });
  }

  async presentLoading() {
    // Prepare a loading controller
    this.loading = await this.loadingController.create({
      message: 'Loading...'
    });
    // Present the loading controller
    await this.loading.present();
  }

  pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then((res) => {
      this.profilePic = res;
      console.log(res);
    }, (err) => {
      // Handle error
    });
  }

    // FILE STUFF
  makeFileIntoBlob(imagePath): Promise<Blob> {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName: string;
      this.file
        .resolveLocalFilesystemUrl(imagePath)
        .then(fileEntry => {
          const { name, nativeURL } = fileEntry;

          // get the path..
          const path = nativeURL.substring(0, nativeURL.lastIndexOf('/'));

          fileName = name;

          // we are provided the name, so now read the file into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          const imgBlob: Blob = new Blob([buffer], {
            type: 'image/jpeg'
          });

          resolve(
            imgBlob
          );
        })
        .catch(e => reject(e));
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  setCanRegister() {
    this.canRegister = !this.canRegister;
  }

  async submit() {
    const locationsToPost: UserLocation[] = [];

    this.visitedMap.selectedArr.forEach(visited => {
      locationsToPost.push({
        userId: this.jwtToken.id,
        locationId: visited.locationId,
        visited: 1,
        toVisit: 0,
        specialCase: ''
      } as UserLocation);
    });

    this.toVisitMap.selectedArr.forEach(toVisit => {
      locationsToPost.push({
        userId: this.jwtToken.id,
        locationId: toVisit.locationId,
        visited: 0,
        toVisit: 1,
        specialCase: ''
      } as UserLocation);
    });

    this.userService.setAuthSubject();

    const postLocations = this.userLocationService.userLocationPostUserLocation(locationsToPost);
    const postProfileImage = this.makeFileIntoBlob(this.profilePic).then(img => this.userService.userUpdateProfileImage(img));

    forkJoin([postLocations, postProfileImage]).subscribe(x => {
      this.router.navigateByUrl('home', { replaceUrl: true });
    });
  }
}
