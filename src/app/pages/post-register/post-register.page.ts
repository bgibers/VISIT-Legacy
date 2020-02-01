import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

import { LoggedInUser } from 'src/app/backend/client/model/loggedInUser';
import { Map } from '../../objects/map';
import { UserService, JwtToken } from 'src/app/backend/client';
import { MapSelectionMode } from '../../objects/enums/map-selection-mode';
@Component({
  selector: 'post-register',
  templateUrl: './post-register.page.html',
  styleUrls: ['./post-register.page.scss']
})
export class PostRegisterPage {
  private jwtToken: JwtToken = {} as JwtToken;
  public user: LoggedInUser = {} as LoggedInUser;
  public profilePic = '../../../assets/defaultuser.png';
  public imageData: any;
  private loading: any;
  private visitedMap: Map;
  private toVisitMap: Map;

  constructor(
    private userService: UserService,
    private router: Router,
    private zone: NgZone,
    private camera: Camera,
    private file: File,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    public loadingController: LoadingController
  ) {
    this.visitedMap = new Map(zone);
    this.toVisitMap = new Map(zone);

    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation().extras.state) {
    //     this.username = this.router.getCurrentNavigation().extras.state.newUser;
    //   }
    // });
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
            console.log(this.user);
            this.jwtToken = token;
            await this.loading.dismiss();
          });
        })
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
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.imageData = res;
      this.profilePic = 'data:image/jpeg;base64,' + res;
      console.log(res)
    }, (err) => {
      // Handle error
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

  submit() {
    this.userService.setAuthSubject();
  }
}
