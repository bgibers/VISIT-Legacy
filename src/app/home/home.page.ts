import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
import am4geodata_canadaLow from '@amcharts/amcharts4-geodata/canadaLow';
import am4geodata_russiaLow from '@amcharts/amcharts4-geodata/russiaLow';
import { JwtToken, UserService, LocationService, UserLocation } from '../backend/client';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Events } from '@ionic/angular';
import { LoggedInUser } from '../backend/client/model/loggedInUser';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private chart: am4maps.MapChart;
  private polygonTemplate: any;
  private worldSeries: am4maps.MapPolygonSeries;
  private usaSeries: am4maps.MapPolygonSeries;
  private canadaSeries: am4maps.MapPolygonSeries;
  private russiaSeries: am4maps.MapPolygonSeries;
  private selectedArea: any;
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

  constructor(private zone: NgZone, private userService: UserService,
              private locationService: LocationService, private router: Router,
              private events: Events, public loadingController: LoadingController) {
                events.subscribe('LocationsAdded', () => {
                  this.ionViewWillEnter();
                });
                this.selectedArea = new am4maps.MapPolygon();
              }

  async ionViewDidEnter() {
  }

  async ionViewWillEnter() {
    await this.presentLoading();
    await this.loadMap();
    this.userService.userGetCurrentUser()
    .pipe(
      finalize(async () => {
        await this.userService.getUserToken().then(
          async (token) => {
            this.jwtToken = token;
            this.getUserLocations();
          });
          // Hide the loading spinner on success or error
        await this.loading.dismiss();
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
       this.changeVisitStatus(obj.locationId, status);
     }
   }

  getUserLocations() {
    console.log('GetUserLoc');
    this.locationService.locationGetLocationsByUserId(this.jwtToken.id).subscribe((result: UserLocation[]) => {
      this.userLocations.next(result);
      this.onLoad();
    });
  }

  async loadMap() {
    console.log('Im entering');
    this.zone.runOutsideAngular(() => {
      let polygonTemplate;
      let worldSeries;
      let usaSeries;
      let canadaSeries;
      let russiaSeries;
      let chart;
      am4core.ready(() => {

      am4core.useTheme(am4themes_animated);

      // Create map instance
      chart = am4core.create('chartdiv', am4maps.MapChart);
      chart.geodata = worldLow;
      chart.projection = new am4maps.projections.Miller();
      chart.zoomControl = new am4maps.ZoomControl();
      chart.tapToActivate = true;

      // Series for World map
      worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
      worldSeries.exclude = ['AQ'];
      worldSeries.useGeodata = true;

      polygonTemplate = worldSeries.mapPolygons.template;
      polygonTemplate.tooltipText = '{name}';
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.applyOnClones = true;
      polygonTemplate.strokeOpacity = 0.5;


      // Create states for world map
      let lastSelected;
      const activeState = polygonTemplate.states.create('active');

      const visited = polygonTemplate.states.create('visited');
      visited.properties.fill = am4core.color('#E94F37');

      const toVisit = polygonTemplate.states.create('toVisit');
      toVisit.properties.fill = am4core.color('#0000FF');

      // Series for United States map
      usaSeries = chart.series.push(new am4maps.MapPolygonSeries());
      usaSeries.geodata = am4geodata_usaLow;

      const usPolygonTemplate = usaSeries.mapPolygons.template;
      usPolygonTemplate.tooltipText = '{name}';
      usPolygonTemplate.nonScalingStroke = true;

      const usVisited = usPolygonTemplate.states.create('visited');
      usVisited.properties.fill = am4core.color('#E94F37');

      const usToVisit = usPolygonTemplate.states.create('toVisit');
      usToVisit.properties.fill = am4core.color('#0000FF');

      // Series for Canada map
      canadaSeries = chart.series.push(new am4maps.MapPolygonSeries());
      canadaSeries.geodata = am4geodata_canadaLow;

      const canadaPolygonTemplate = canadaSeries.mapPolygons.template;
      canadaPolygonTemplate.tooltipText = '{name}';
      canadaPolygonTemplate.nonScalingStroke = true;

      const canadaVisited = canadaPolygonTemplate.states.create('visited');
      canadaVisited.properties.fill = am4core.color('#E94F37');

      const canadaToVisit = canadaPolygonTemplate.states.create('toVisit');
      canadaToVisit.properties.fill = am4core.color('#0000FF');

      // Series for Russia map
      russiaSeries = chart.series.push(new am4maps.MapPolygonSeries());
      russiaSeries.geodata = am4geodata_russiaLow;

      const russiaPolygonTemplate = russiaSeries.mapPolygons.template;
      russiaPolygonTemplate.tooltipText = '{name}';
      russiaPolygonTemplate.nonScalingStroke = true;

      const russiaVisited = russiaPolygonTemplate.states.create('visited');
      russiaVisited.properties.fill = am4core.color('#E94F37');

      const russiaToVisit = russiaPolygonTemplate.states.create('toVisit');
      russiaToVisit.properties.fill = am4core.color('#0000FF');

      polygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;
          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);
          this.selectedArea = data;
          // https://codepen.io/team/amcharts/pen/qgLprb
          // create seperate json file to read id's from

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
          lastSelected = ev.target;
        }
      });
      polygonTemplate.events.off('doubleHit');


      usPolygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;
          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);
          this.selectedArea = data;

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
          lastSelected = ev.target;
        }
      });

      canadaPolygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;
          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);
          this.selectedArea = data;

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
          lastSelected = ev.target;
        }
      });

      russiaPolygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;
          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);
          this.selectedArea = data;

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
          lastSelected = ev.target;
        }
      });

      // Home button
      const homeButton = new am4core.Button();
      homeButton.events.on('hit', () => {
        chart.goHome();
      });

      const addButton = new am4core.Button();
      addButton.events.on('hit', () => {
        this.changeVisitStatus(lastSelected.dataItem.dataContext.id, 'toVisit');
      });

      homeButton.icon = new am4core.Sprite();
      homeButton.padding(7, 5, 7, 5);
      homeButton.width = 30;
      homeButton.icon.path = 'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
      homeButton.marginBottom = 10;
      homeButton.parent = chart.zoomControl;
      homeButton.insertBefore(chart.zoomControl.plusButton);

    }); // end am4core.ready()

      // get longs and lat of clicked spot
      // custom loader
      // create onload function to read in all visited locations
      // read in from json file
      // https://www.amcharts.com/docs/v4/reference/spritestate/

      this.chart = chart;
      this.polygonTemplate = polygonTemplate;
      this.worldSeries = worldSeries;
      this.usaSeries = usaSeries;
      this.canadaSeries = canadaSeries;
      this.russiaSeries = russiaSeries;
    });
  }

  async changeVisitStatus(locationId, status) {
    // ($('#myModal') as any).modal('show');
    console.log(locationId);
    const worldSeries = this.worldSeries;
    const usaSeries = this.usaSeries;
    const canadaSeries = this.canadaSeries;
    const russiaSeries = this.russiaSeries;
    let selectedArea = new am4maps.MapPolygon();

    if (locationId.toString().includes('US-')) {
      selectedArea = usaSeries.getPolygonById(locationId);
      console.log(selectedArea);

    } else if (locationId.toString().includes('CA-')) {
      selectedArea = canadaSeries.getPolygonById(locationId);
      console.log(selectedArea);

    } else if (locationId.toString().includes('RU-')) {
      selectedArea = russiaSeries.getPolygonById(locationId);
      console.log(selectedArea);

    } else {
      selectedArea = worldSeries.getPolygonById(locationId);
      console.log(selectedArea);

    }

    // const selectedArea = this.selectedArea;

    console.log(selectedArea);

    // ($('#myModalTitle') as any).text(data.dataItem.dataContext.name);

    if (status === 'visited') {
     selectedArea.setState('visited');
    } else if (status === 'toVisit') {
     selectedArea.setState('toVisit');
    }

    this.selectedArea = selectedArea;
  }

  ionViewWillLeave() {
    console.log('Im leaving');
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  async editProfile() {
    // console.log(this.jwtToken.id);
  }

  async logout() {
    await this.userService.logout().then(() => {
      this.user = undefined;
      this.jwtToken = undefined;
      console.log(this.userService.getLoggedInUser);
      this.router.navigateByUrl('login', { replaceUrl: true });
    });
  }

}
