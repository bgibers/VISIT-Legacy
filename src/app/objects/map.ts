import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4geodata_usaLow from '@amcharts/amcharts4-geodata/usaLow';
import am4geodata_canadaLow from '@amcharts/amcharts4-geodata/canadaLow';
import am4geodata_russiaLow from '@amcharts/amcharts4-geodata/russiaLow';

export class Map {
  private chart: am4maps.MapChart;
  private polygonTemplate: any;
  private worldSeries: am4maps.MapPolygonSeries;
  private usaSeries: am4maps.MapPolygonSeries;
  private canadaSeries: am4maps.MapPolygonSeries;
  private russiaSeries: am4maps.MapPolygonSeries;
  private selectedArea: any;
  private selectionMode: MapSelectionMode;

  constructor(private zone: NgZone) {
    this.selectedArea = new am4maps.MapPolygon();
  }

  async createMap(divName: string) {
    this.zone.runOutsideAngular(() => {
      let polygonTemplate;
      let worldSeries;
      let usaSeries;
      let canadaSeries;
      let russiaSeries;
      let chart: am4maps.MapChart;
      am4core.ready(() => {
        am4core.useTheme(am4themes_animated);

        // Create map instance
        chart = am4core.create(divName, am4maps.MapChart);
        chart.geodata = worldLow;
        chart.projection = new am4maps.projections.Miller();
        chart.zoomControl = new am4maps.ZoomControl();
        chart.zoomControl.plusButton.hide();
        chart.zoomControl.minusButton.hide();
        chart.tapToActivate = true;

        // Home button
        const homeButton = new am4core.Button();
        homeButton.events.on('hit', () => {
                  chart.goHome();
                });

        homeButton.icon = new am4core.Sprite();
        homeButton.padding(7, 5, 7, 5);
        homeButton.width = 30;
        homeButton.icon.path =
                  'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
        homeButton.marginBottom = 10;
        homeButton.parent = chart.zoomControl;
        homeButton.insertAfter(chart.zoomControl.minusButton);

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

        polygonTemplate.events.on('hit', ev => {
          const data = ev.target.dataItem.dataContext;
          this.selectedArea = data;
          // https://codepen.io/team/amcharts/pen/qgLprb
          // create seperate json file to read id's from

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
        });
        polygonTemplate.events.off('doubleHit');

        usPolygonTemplate.events.on('hit', ev => {
          const data = ev.target.dataItem.dataContext;
          this.selectedArea = data;

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
        });
        usPolygonTemplate.events.off('doubleHit');

        canadaPolygonTemplate.events.on('hit', ev => {
          const data = ev.target.dataItem.dataContext;
          this.selectedArea = data;

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
        });
        canadaPolygonTemplate.events.off('doubleHit');

        russiaPolygonTemplate.events.on('hit', ev => {
          const data = ev.target.dataItem.dataContext;
          this.selectedArea = data;

          ev.target.series.chart.zoomToMapObject(ev.target);
          if (lastSelected !== ev.target) {
            lastSelected = ev.target;
          }
        });
        russiaPolygonTemplate.events.off('doubleHit');
      });
      this.chart = chart;
      this.polygonTemplate = polygonTemplate;
      this.worldSeries = worldSeries;
      this.usaSeries = usaSeries;
      this.canadaSeries = canadaSeries;
      this.russiaSeries = russiaSeries;
    });
  }

  async changeVisitStatus(locationId, status) {
    const worldSeries = this.worldSeries;
    const usaSeries = this.usaSeries;
    const canadaSeries = this.canadaSeries;
    const russiaSeries = this.russiaSeries;
    let selectedArea = new am4maps.MapPolygon();

    if (locationId.toString().includes('US-')) {
      selectedArea = usaSeries.getPolygonById(locationId);
    } else if (locationId.toString().includes('CA-')) {
      selectedArea = canadaSeries.getPolygonById(locationId);
    } else if (locationId.toString().includes('RU-')) {
      selectedArea = russiaSeries.getPolygonById(locationId);
    } else {
      selectedArea = worldSeries.getPolygonById(locationId);
    }

    if (status === 'visited') {
      selectedArea.setState('visited');
    } else if (status === 'toVisit') {
      selectedArea.setState('toVisit');
    }

    this.selectedArea = selectedArea;
  }

  destroyMap() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
