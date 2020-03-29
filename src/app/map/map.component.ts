import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Feature } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { getCenter } from 'ol/extent';
import { defaults as defaultInteractions } from 'ol/interaction';
import Select from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
import { AnimateToExtentControl } from './animateToExtent';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy {

  public map: Map;
  private subscription = new Subscription();
  private featuresWithData: Feature[];
  private selectHandler = new Select({
    style: new Style({
      fill: new Fill({ color: '#606060' }),
      stroke: new Stroke({ color: '#101010', width: 2 }),
      zIndex: 2
    })
  });

  constructor(private dataService: DataService) { }

  ngAfterViewInit(): void {
    this.subscription.add(this.dataService.$featuresWithData.subscribe((result) => {
      this.featuresWithData = result;
      this.setMap()
    }));

    this.subscription.add(this.dataService.$featureClicked.subscribe((result) => {
      this.zoomToFeature(result);
      this.handleSelectedFeature(result);
    }));

    this.selectHandler.on('select', (selection) => {
      this.zoomToFeature(selection.selected[0]);
    });
  }

  zoomToFeature(feature) {
    const currentView = this.map.getView();
    const featureGeometry = feature.getGeometry();
    const featureResolution = currentView.getResolutionForExtent(featureGeometry.getExtent())
    const viewResolution = currentView.getResolution();
    const featureCenter = getCenter(featureGeometry.getExtent());
    const minFeatureResolution = 1400
    let startingTimeout = 300;

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

  private handleSelectedFeature(feat): void {
    this.selectHandler.getFeatures().clear()
    this.selectHandler.getFeatures().push(feat);
    this.selectHandler.dispatchEvent({
      type: 'select',
      selected: [feat],
      deselected: []
    });
  }

  private setMap() {
    const vectorLayer = this.getVectorLayer();
    const view = this.getViewForMap();

    this.map = new Map({
      target: 'map',
      layers: [vectorLayer],
      view: view,
      interactions: defaultInteractions().extend([
        this.selectHandler
      ]),
      controls: defaultControls().extend([
        new AnimateToExtentControl()
      ]),
    });
  }


  private getVectorLayer(): VectorLayer {
    const style = this.getStyleVectorFeatures()
    const vectorSource = new VectorSource({
      overlaps: false,
      features: this.featuresWithData
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: style,
      updateWhileAnimating: true
    });

    return vectorLayer;
  }

  private getStyleVectorFeatures(): Style {
    const style = new Style({
      fill: new Fill({ color: '#404040' }),
      stroke: new Stroke({ color: '#202020', width: 1.5 })
    });

    return style;
  }

  private getViewForMap(): View {
    const view = new View({
      center: [950000, 7600000],
      zoom: 3.9,
      extent: [-3500000, 3800000, 5000000, 11500000]
    })

    return view;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
