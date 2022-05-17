import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {Vector} from 'ol/layer';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {Vector as VecSource} from 'ol/source';
import OSM from 'ol/source/OSM';
import {Map as OLMap, View} from 'ol';
import {Fill, Stroke, Style} from 'ol/style';
import * as d3 from 'd3';
import {HttpClient} from "@angular/common/http";
import {GeoJSON} from "ol/format";
import {Draw, Select, Translate, defaults as defaultInteractions,} from "ol/interaction";
import GeometryType from "ol/geom/GeometryType";
import {click, pointerMove} from "ol/events/condition";
import {interpolateBlues} from "d3";
import { environment } from '../../environments/environment.prod';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer';
import {transform, toLonLat, fromLonLat} from 'ol/proj';
import RasterSource from 'ol/source/Raster';
import {createXYZ} from 'ol/tilegrid';
import Map from 'ol/Map';
import Tile from 'ol/layer/Tile.js';
import * as olProj from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import MousePosition from 'ol/control/MousePosition';
import Layer from 'ol/layer/Layer';
import {createStringXY} from 'ol/coordinate';
import {defaults as defaultControls} from 'ol/control';
import { __values } from 'tslib';
import { ValueTransformer } from '@angular/compiler/src/util';
import { scaleLinear } from 'd3-scale';
import { DataService } from '../data.service';



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  constructor(private dataService: DataService, private http: HttpClient){ }
  map: any;
  
  mousePosition: number[] = [0, 0];
  @Output() newItemEvent = new EventEmitter<string>();
  vector: any;

  ngAfterViewInit(): void {
    //create map

    const mousePositionControl  = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      className: 'custom-mouse-position'
    });

    var color = d3.interpolateBlues(0);

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        url: 'http://127.0.0.1:8080/network',
        format: new GeoJSON(),
      }),
      style: function (feature) {
        return new Style({
          stroke: new Stroke({
            color:  interpolateBlues((feature.getProperties()['chi-jun-21'])/360),
            width: 4
          })
        })
      }
    });

    const tileLayer = new TileLayer({
      source: new OSM({
        url: 'https://api.maptiler.com/maps/positron/256/{z}/{x}/{y}.png?key=7EpFZTFkvcQ9zDad03lC'
      }),
    });

    var source =  new VecSource();
    
    var drawVector = new Vector({
      source: source,
      style: new Style({
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 1)',
          width: 2,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 0, 0.3)',
        }),
      }),
    });

    var draw = new Draw({
      source: source,
      type: GeometryType.POLYGON,
    });

    var select = new Select({
      condition: click,
    });


    var translate = new Translate({
      features: select.getFeatures(),
    });

    

    var map = new Map({
      interactions: defaultInteractions().extend([select, translate]),
      controls: defaultControls().extend([mousePositionControl]),
      target: 'map',
      layers: [tileLayer,vectorLayer,drawVector],
      view: new View({
        center: transform([-87.6298, 41.8781], 'EPSG:4326', 'EPSG:3857'),
        zoom: 15,
      }),
    });
    

    map.on('pointermove', (evt: any) => {
      this.mousePosition = evt.pixel;
      map.render();
    });

    source.on('addfeature', function(evt){
      draw.setActive(false);
    });

    var selected_id:any;
    map.addInteraction(draw);

    select.on('select', (event: any) => {
      let coordinates = event.selected[0].getGeometry().getCoordinates()
      console.log(coordinates)
      this.dataService.changeCoordinates(coordinates[0])
    });

    translate.on('translating', (event: any) => {
      var features = drawVector.getSource().getFeatures();
      features.forEach((feature: any) => {

          let feature_coordinates = feature.getGeometry().getCoordinates();
          this.dataService.changeCoordinates(feature_coordinates[0])

      });
    });
    
  }

  updateValues(values:any) {
    // Emit new values to chart component
    //this.newItemEvent.emit(values);
  }
  
  
}
