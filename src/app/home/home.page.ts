import { Component, AfterViewInit, NgZone, OnDestroy } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
import am4geodata_canadaLow from '@amcharts/amcharts4-geodata/canadaLow';
import am4geodata_russiaLow from '@amcharts/amcharts4-geodata/russiaLow';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {

  private chart: am4maps.MapChart;
  private polygonTemplate: any;
  private worldSeries: am4maps.MapPolygonSeries;
  private usaSeries: am4maps.MapPolygonSeries;
  private canadaSeries: am4maps.MapPolygonSeries;
  private russiaSeries: am4maps.MapPolygonSeries;

  constructor(private zone: NgZone) {}

  changeVisitStatus(locationId, status) {
    // ($('#myModal') as any).modal('show');
    console.log(location);
    let data;
    const worldSeries = this.worldSeries;
    const usaSeries = this.usaSeries;
    const canadaSeries = this.canadaSeries;
    const russiaSeries = this.russiaSeries;

    if (locationId.toString().includes('US-')) {
        data = usaSeries.getPolygonById(locationId);
     } else if (locationId.toString().includes('CA-')) {
        data = canadaSeries.getPolygonById(locationId);
     } else if (locationId.toString().includes('RU-')) {
        data = russiaSeries.getPolygonById(locationId);
     } else {
        data = worldSeries.getPolygonById(locationId);
     }

    // ($('#myModalTitle') as any).text(data.dataItem.dataContext.name);

    if (status === 'visited') {
       data.setState('visited');
     } else if (status === 'toVisit') {
       data.setState('toVisit');
     }
   }

  onLoad() {
     const jsonObj = [
       {
           location : 'US-SC',
           status : 'visited'
       }
     ];
     for (const obj of jsonObj) {
       this.changeVisitStatus(obj.location, obj.status);
     }
   }

   ionViewDidEnter() {
     this.ngAfterViewInit();
   }

   ngAfterViewInit() {
    console.log('Im entering');
    this.zone.runOutsideAngular(() => {
      let polygonTemplate;
      let worldSeries;
      let usaSeries;
      let canadaSeries;
      let russiaSeries;
      let chart;
      am4core.ready(() => {

      // Themes begin
      am4core.useTheme(am4themes_animated);
      // Themes end

      // Create map instance
      chart = am4core.create('chartdiv', am4maps.MapChart);
      // chart.background.fill = am4core.color("#aadaff");
      // chart.background.fillOpacity = 1;
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
      // polygonTemplate.fill = chart.colors.getIndex(0);
      polygonTemplate.nonScalingStroke = true;
      polygonTemplate.applyOnClones = true;
      // polygonTemplate.togglable = true;
      polygonTemplate.strokeOpacity = 0.5;


      // Create states for world map
      let lastSelected;
      const activeState = polygonTemplate.states.create('active');
      // activeState.properties.fill = chart.colors.getIndex(4);

      // var hs = polygonTemplate.states.create("hover");
      // hs.properties.fill = chart.colors.getIndex(4);

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
      russiaVisited.properties.fill = am4core.color('#0000FF');

      const russiaToVisit = russiaPolygonTemplate.states.create('toVisit');
      russiaToVisit.properties.fill = am4core.color('#E94F37');


      // Hover state
      // var usahs = usPolygonTemplate .states.create("hover");
      // usahs.properties.fill = chart.colors.getIndex(4);

      console.log(polygonTemplate);
      console.log(worldSeries);

      polygonTemplate.events.on('hit', (ev) => {
          const data = ev.target.dataItem.dataContext;
          console.log(data.id);
          console.log(data.name);
          console.log(data.visited);
          // chttps://codepen.io/team/amcharts/pen/qgLprb
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

      // new location button

      addButton.padding(7, 5, 7, 5);
      addButton.width = 30;
      addButton.marginBottom = 10;
      addButton.parent = chart.zoomControl;

      const editImage = addButton.createChild(am4core.Image);
      editImage.href = '../../assets/icon/heart.png';
      editImage.width = 15;
      editImage.height = 15;
      addButton.insertBefore(chart.zoomControl);

      const legend = new am4maps.Legend();
      legend.parent = chart.chartContainer;
      legend.background.fill = am4core.color('#000');
      legend.background.fillOpacity = 0.15;
      legend.width = 90;
      legend.height = 90;
      legend.align = 'left';
      legend.valign = 'bottom';
      legend.contentAlign = 'left';
      legend.padding(10, 15, 10, 15);
      legend.labels.template.wrap = true;
      legend.labels.template.scale = .45;
      legend.labels.template.maxWidth = 80;
      legend.data = [{
        name: 'Plans to visit',
        fill: '#0000FF'
      }, {
        name: 'Visited',
        fill: '#E94F37'
      }];
      legend.itemContainers.template.clickable = false;
      legend.itemContainers.template.focusable = false;


      // manually trigger event
      // chart.zoomOutButton.dispatchImmediately("hit");
      // https://www.amcharts.com/docs/v4/concepts/event-listeners/
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
  ionViewDidLeave() {
  
    console.log('Im leaving');
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
