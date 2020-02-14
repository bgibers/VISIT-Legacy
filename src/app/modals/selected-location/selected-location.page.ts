import { Component, OnInit, AfterViewInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
import am4geodata_canadaLow from '@amcharts/amcharts4-geodata/canadaLow';
import am4geodata_russiaLow from '@amcharts/amcharts4-geodata/russiaLow';
import { JwtToken, UserService, LocationService, UserLocationService, UserLocation } from '../../backend/client';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-selected-location',
  templateUrl: './selected-location.page.html',
  styleUrls: ['./selected-location.page.scss'],
})
export class SelectedLocationPage {
  private chart: am4maps.MapChart;
  private polygonTemplate: any;
  private worldSeries: am4maps.MapPolygonSeries;
  private usaSeries: am4maps.MapPolygonSeries;
  private canadaSeries: am4maps.MapPolygonSeries;
  private russiaSeries: am4maps.MapPolygonSeries;
  private selectedArea: any;
  private _statusToSend: any;
  private _name: string;
  private _id: any;
  private jwtToken: JwtToken;
  private userLocations: BehaviorSubject<UserLocation[]> = new BehaviorSubject([]);
  private newLocations: UserLocation[] = [{
    id: 0,
    toVisit: 0,
    visited: 0,
    userId: '',
    locationId: undefined
  }];

  constructor(private navParams: NavParams,
              private modalCtrl: ModalController,
              private zone: NgZone,
              private ref: ChangeDetectorRef,
              private userService: UserService,
              private locationService: LocationService,
              private userLocationService: UserLocationService,
              private events: Events) {}


  get selectedId() {
    return this._id;
  }

  set selectedId(id) {
      this._id = id;
  }

  get selectedName() {
    return this._name;
  }

  set selectedName(name) {
      this._name = name;
  }

  get statusToSend() {
    return this._statusToSend;
  }

  set statusToSend(status) {
      this._statusToSend = status;
  }

  ionViewDidEnter() {
    this.onLoad();
  }

  async ionViewWillEnter() {
    await this.loadMap();
    this.jwtToken = await this.userService.getUserToken();
    this.getUserLocations();
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
        chart = am4core.create('addLocationDiv', am4maps.MapChart);

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
        // usPolygonTemplate.fill = chart.colors.getIndex(1);
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

        console.log(polygonTemplate);
        console.log(worldSeries);

        polygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;

          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);

          this.selectedArea = data;
          this.selectedName = data.name;
          this.selectedId = data.id;

          console.log('name :' + this.selectedName);
          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
          this.ref.detectChanges();
        });
        polygonTemplate.events.off('doubleHit');


        usPolygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;

          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);

          this.selectedArea = data;
          this.selectedName = data.name;
          this.selectedId = data.id;

          console.log('name :' + this.selectedName);
          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
          this.ref.detectChanges();
        });

        canadaPolygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;

          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);

          this.selectedArea = data;
          this.selectedName = data.name;
          this.selectedId = data.id;

          console.log('name :' + this.selectedName);
          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
          lastSelected = ev.target;
          }
          this.ref.detectChanges();
        });

        russiaPolygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;

          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);

          this.selectedArea = data;
          this.selectedName = data.name;
          this.selectedId = data.id;

          console.log('name :' + this.selectedName);
          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
          this.ref.detectChanges();
      });

        // Home button
        const homeButton = new am4core.Button();
        homeButton.events.on('hit', () => {
          chart.goHome();
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

  changeVisitStatus(locationId, status, initialLoad) {
    // ($('#myModal') as any).modal('show');
    console.log(locationId);
    const worldSeries = this.worldSeries;
    const usaSeries = this.usaSeries;
    const canadaSeries = this.canadaSeries;
    const russiaSeries = this.russiaSeries;
    let selectedArea;

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

    console.log(this.selectedArea);

    // ($('#myModalTitle') as any).text(data.dataItem.dataContext.name);

    if (status === 'visited' || status === 'lived') {
      selectedArea.setState('visited');
    } else if (status === 'toVisit' || status === 'dream') {
      selectedArea.setState('toVisit');
    }

    if (!initialLoad) {
      const newLocation: UserLocation = {
        userId: this.jwtToken.id,
        locationId,
        visited: status === 'visited' ? 1 : 0,
        toVisit: status === 'toVisit' ? 1 : 0,
        specialCase: ''
      } as UserLocation;

      this.newLocations.push(newLocation);
    }

    this.selectedArea = selectedArea;
  }

  onLoad() {
    console.log('OnLoad');
    for (const obj of this.userLocations.value) {
       let status: string;
       if (obj.visited === 1) {
         status = 'visited';
       } else if (obj.toVisit === 1) {
         status = 'toVisit';
       }
       console.log(obj.visited);
       this.changeVisitStatus(obj.locationId, status, true);
     }
   }

  ionViewWillLeave() {

    console.log('Im leaving');
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  // call to service for searching

  // call to service on publish


  onChangeHandler(event: any) {
    this.statusToSend = event.detail.value;
    console.log(this.statusToSend);
  }

  submit() {
      this.newLocations = this.newLocations.filter(l => l.locationId !== undefined);
      this.userLocationService.userLocationPostUserLocation(this.newLocations).pipe(take(1)).subscribe((result: UserLocation) => {
        this.events.publish('LocationsAdded');
        this.modalCtrl.dismiss();
      });
  }

  cancel() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
   this.modalCtrl.dismiss();
  }

}
