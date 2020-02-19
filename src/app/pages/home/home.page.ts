import { Component, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { JwtToken, UserService, LocationService, UserLocation } from '../../backend/client';
import { LoggedInUser } from '../../backend/client/model/loggedInUser';
import { Map } from '../../objects/map';
import { MapSelectionMode } from '../../objects/enums/map-selection-mode';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public visitedCount = 0;
  public futureCount = 0;
  private jwtToken: JwtToken = {} as JwtToken;
  public user: LoggedInUser =  {} as LoggedInUser;
  public profilePic: any;
  public hometownPic: any;
  public nextVisitPic: any;
  public currentCityPic: any;
  public currentCity: string;
  public hometown: string;
  private userLocations: BehaviorSubject<UserLocation[]> = new BehaviorSubject([]);
  private loading: any;
  private map: Map;

  constructor(private userService: UserService, private zone: NgZone,
              private locationService: LocationService, private router: Router,
              private events: Events, public loadingController: LoadingController) {}

  ngOnInit() {
    this.map = new Map(this.zone);
    this.events.subscribe('LocationsAdded', () => {
      this.getUserLocations();
    });
  }

  ionViewDidEnter() {
  }

  async ionViewWillEnter() {
    await this.presentLoading();
    await this.map.createMap('homeMap', MapSelectionMode.NONE);
    this.userService.userGetCurrentUser()
    .pipe(
      finalize(async () => {
        await this.userService.getUserToken().then(
          async (token) => {
            this.jwtToken = token;
            this.getUserLocations();
          });
      })
    )
    .subscribe(res => {
      this.user = res;
      this.hometown = this.user.birthPlace.name;
      this.currentCity = this.user.residesIn.name;
      this.hometownPic = 'data:image/jpeg;base64,' + this.user.birthPlace.image;
      this.currentCityPic = 'data:image/jpeg;base64,' + this.user.residesIn.image;
      if (res.avi === null) {
        this.profilePic = '../assets/defaultuser.png';
      } else {
        this.profilePic = 'data:image/jpeg;base64,' + res.avi;
      }
      this.loading.dismiss();
    });
  }

  presentLoading() {
    // Prepare a loading controller
    this.loading = this.loadingController.create({
        message: 'Loading...'
    });
    // Present the loading controller
    this.loading.present();
  }

  onLoad() {
    console.log('OnLoad');
    this.futureCount = 0;
    this.visitedCount = 0;
    for (const obj of this.userLocations.value) {
       let status: string;
       if (obj.visited === 1) {
         status = 'visited';
         this.visitedCount++;
       } else if (obj.toVisit === 1) {
         status = 'toVisit';
         this.futureCount++;
       }
       console.log(obj.visited);
       this.map.changeVisitStatus(obj.locationId, status);
     }
   }

  getUserLocations() {
    this.locationService.locationGetLocationsByUserId(this.jwtToken.id).pipe(take(1)).subscribe((result: UserLocation[]) => {
      this.userLocations.next(result);
      this.onLoad();
    });
  }

  ionViewWillLeave() {
    this.map.destroyMap();
  }

  async editProfile() {
    // console.log(this.jwtToken.id);
  }

  async logout() {
    await this.userService.logout().then(() => {
      this.user = undefined;
      this.jwtToken = undefined;
      this.router.navigateByUrl('login', { replaceUrl: true });
    });
  }

}
