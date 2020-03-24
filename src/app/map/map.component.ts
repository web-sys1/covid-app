import { AfterViewInit, Component, OnInit } from '@angular/core';
import { buffer } from 'ol/extent';
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
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {

  public map: OlMap;

  constructor() { }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    const style = new Style({
      fill: new Fill({
        color: '#000000'
      }),
      stroke: new Stroke({
        color: '#202020',
        width: 1
      })
    });

    const vectorSource = new VectorSource({
      features: (new TopoJSON()).readFeatures(data)
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style
    });

    const extent = [-3506188.846553889, 3808238.996511435, 5043694.81020748, 11552231.6474777]
    const extentWithBuffer = buffer(extent, 2000000);

    this.map = new OlMap({
      target: 'map',
      layers: [vectorLayer],

      view: new View({
        center: [953408.4735, 7577321.8637],
        zoom: 3.9,
        extent: extentWithBuffer
      }),
    });
  }

}
