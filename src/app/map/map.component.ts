import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Vector as VectorLayer } from 'ol/layer';
import OlMap from 'ol/Map';
import { Vector as VectorSource } from 'ol/source';
import { Fill, Stroke, Style } from 'ol/style';
import View from 'ol/View';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscription: Subscription;
  public map: OlMap;
  private featuresWithData;

  constructor(private dataService: DataService) {

  }
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.subscription = this.dataService.$featuresWithData.subscribe((result) => {
      this.featuresWithData = result;
      this.setMap()
    })
  }

  private setMap() {
    const style = this.getStyleForMap();
    const extent = [-3500000, 3800000, 5000000, 11500000];

    const vectorSource = new VectorSource({
      features: this.featuresWithData
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style
    });

    const view = new View({
      center: [950000, 7600000],
      zoom: 3.9,
      extent: extent
    })

    this.map = new OlMap({
      target: 'map',
      layers: [vectorLayer],
      view: view,
    });
  }

  private getStyleForMap() {
    const style = new Style({
      fill: new Fill({ color: '#404040' }),
      stroke: new Stroke({
        color: '#202020',
        width: 1.5
      })
    });

    return style;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
