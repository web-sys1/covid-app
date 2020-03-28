import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Feature } from 'ol';
import { Extent, getCenter } from 'ol/extent';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

  private subscription = new Subscription();
  public map: Map;
  private featuresWithData: Feature[];

  constructor(private dataService: DataService) {

  }
  ngOnInit(): void {

  }

  zoomToFeature(feature) {
    const currentView = this.map.getView();
    const featureGeometry = feature.getGeometry();
    const featureResolution = currentView.getResolutionForExtent(featureGeometry.getExtent())
    const viewResolution = currentView.getResolution();
    const featureCenter = getCenter(featureGeometry.getExtent());
    let startingTimeout = 300;
    const minFeatureResolution = 1400

    const fitView = () => this.map.getView().fit(featureGeometry, { padding: [50, 50, 50, 50], duration: 1000 });

    if (currentView.getZoom() > 7 || featureResolution < 500) {
      if (featureResolution > minFeatureResolution)
        currentView.animate({ resolution: featureResolution, duration: 300 })
      else if (viewResolution < minFeatureResolution * 1.15)
        currentView.animate({ resolution: minFeatureResolution, duration: 300 })
      else
        startingTimeout = 0

      if (featureResolution < viewResolution || (viewResolution < 500 && featureResolution < minFeatureResolution)) {
        setTimeout(() => currentView.animate({ center: featureCenter, duration: 1000 }), startingTimeout);
        setTimeout(fitView, startingTimeout + 1000);
      } else
        setTimeout(fitView, startingTimeout);
    } else
      fitView();
  }

  ngAfterViewInit(): void {
    this.subscription.add(this.dataService.$featuresWithData.subscribe((result) => {
      this.featuresWithData = result;
      this.setMap()
    }));

    this.subscription.add(this.dataService.$featureClicked.subscribe((result) => {
      this.zoomToFeature(result);
    }));
  }

  private setMap() {
    const style = this.getStyleForMap();
    const extent: Extent = [-3500000, 3800000, 5000000, 11500000];

    const vectorSource = new VectorSource({
      overlaps: false,
      features: this.featuresWithData
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style,
      updateWhileAnimating: true
    });

    const view = new View({
      center: [950000, 7600000],
      zoom: 3.9,
      extent: extent
    })

    this.map = new Map({
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
