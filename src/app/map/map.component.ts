import { AfterViewInit, Component, OnInit } from '@angular/core';
import TopoJSON from 'ol/format/TopoJSON';
import { Vector as VectorLayer } from 'ol/layer';
import OlMap from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import View from 'ol/View';
import data from '../_administrative-data/geo_eu.json';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss',
    // '../../../node_modules/ol/ol.css',
    // '../../../node_modules/ol-ext/dist/ol-ext.css'
  ],
  // encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit, AfterViewInit {

  public map: OlMap;

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    var style = new Style({
      fill: new Fill({
        color: '#000000'
      }),
      stroke: new Stroke({
        color: '#202020',
        width: 1
      })
    });

    var vectorSource = new VectorSource({
      features: (new TopoJSON()).readFeatures(data)
    });

    var vector = new VectorLayer({
      source: vectorSource,
      style: style
    });


    this.map = new OlMap({
      target: 'map',
      layers: [
        vector
      ],
      view: new View({
        center: [703079.7791264898, 7829220.284081122],
        zoom: 3.65
      }),
    });
  }

}
