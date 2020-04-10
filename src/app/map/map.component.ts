import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as GeoStats from 'geostats';
import { Feature } from 'ol';
import { defaults as defaultControls } from 'ol/control';
import { getCenter } from 'ol/extent';
import { defaults as defaultInteractions } from 'ol/interaction';
import Select from 'ol/interaction/Select';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { get as getProjection } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import View from 'ol/View';
import { Subscription } from 'rxjs';
import { CountryCovidData } from '../models/countryCovidData.model';
import { DataService } from '../services/data.service';
import { AnimateToExtentControl } from './animateToExtent';
import { JenksDataClassification } from './jenksBreaksClassification';
import { PrettyBreaksRangesGenerator } from './prettyBrakesClassification';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [PrettyBreaksRangesGenerator, JenksDataClassification]
})
export class MapComponent implements AfterViewInit, OnDestroy {

  public map: Map;
  private subscription = new Subscription();
  private vectorSource: VectorSource;
  private featuresWithData: Feature[];
  private colorBreaks: number[];
  private selectHandler = new Select();

  constructor(private dataService: DataService,
    // private prettyBreaksGenerator: PrettyBreaksRangesGenerator,
    private jenksBreaksGenerator: JenksDataClassification
  ) { }

  ngAfterViewInit(): void {
    this.subscription.add(this.dataService.$featuresWithData.subscribe((result) => {
      this.featuresWithData = result;
      this.setMap()
    }));

    this.subscription.add(this.dataService.$featureClicked.subscribe((result) => {
      this.handleSelectedFeature(result);
    }));

    this.selectHandler.on('select', (selection) => {
      const selectedFeature = selection.selected[0];
      if (selectedFeature) {
        const selectedStyle = new Style({
          fill: new Fill({ color: '#404040' }),
          //yellow color for selected items stroke - testing
          stroke: new Stroke({ width: 5, color: '#ffff00' }),
          zIndex: 10
        })
        this.zoomToFeature(selectedFeature);
        this.selectHandler.getFeatures().getArray()[0].setStyle(selectedStyle);
      }
    });
  }


  // Change current classification method if neccessary:
  // jenksBreaks - this.jenksBreaksGenerator.getJenksClassification(dataValues, 6);
  // prettyBreaks - this.prettyBreaksGenerator.calculateRanges(dataValues, 6);
  // quantileBreaks - geoStats.getClassQuantile(6)
  // arithmeticBreaks - geoStats.getClassArithmeticProgression(6);
  // geometricBreaks - geoStats.getClassGeometricProgression(6);

  private getClassificationBreaks(dataValues: number[]): number[] {
    const geoStats = new GeoStats();
    geoStats.serie = dataValues;
    const jenksBreaks = this.jenksBreaksGenerator.getJenksClassification(dataValues, 6);

    return jenksBreaks;
  }

  zoomToFeature(feature): void {
    const currentView = this.map.getView();
    const featureGeometry = feature.getGeometry();
    const featureResolution = currentView.getResolutionForExtent(featureGeometry.getExtent())
    const viewResolution = currentView.getResolution();
    const featureCenter = getCenter(featureGeometry.getExtent());
    const minFeatureResolution = 0.025
    let startingTimeout = 300;

    const fitView = () => this.map.getView().fit(featureGeometry, { padding: [50, 50, 50, 50], duration: 1000 });
    if ((currentView.getZoom() > 7 || featureResolution < 0.0002)) {
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

  private getColor(feature: Feature): string {
    const actualData = <CountryCovidData>feature.getProperties()["actualData"];
    if (actualData) {
      if (actualData.cases > this.colorBreaks[5])
        return 'rgba(165,15,21,0.6)';
      else if (actualData.cases > this.colorBreaks[4] && actualData.cases <= this.colorBreaks[5])
        return 'rgba(222,45,38,0.6)';
      else if (actualData.cases > this.colorBreaks[3] && actualData.cases <= this.colorBreaks[4])
        return 'rgba(251,106,74,0.6)';
      else if (actualData.cases > this.colorBreaks[2] && actualData.cases <= this.colorBreaks[3])
        return 'rgba(252,146,114,0.6)';
      else if (actualData.cases > this.colorBreaks[1] && actualData.cases <= this.colorBreaks[2])
        return 'rgba(252,187,161,0.6)';
      else if (actualData.cases <= this.colorBreaks[1])
        return 'rgba(254,229,217,0.6)';
    } else {
      //yellow color for countries without data - testing
      return '#ffff00'
    }
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

  private setMap(): void {
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

    this.colorPolygonsByValues();
  }

  private getVectorLayer(): VectorLayer {
    const style = this.getStyleVectorFeatures()
    this.vectorSource = new VectorSource({
      overlaps: false,
      useSpatialIndex: false,
      wrapX: false,
      features: this.featuresWithData
    });

    const vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: style,
      updateWhileAnimating: true
    });

    return vectorLayer;
  }

  private getStyleVectorFeatures(): Style {
    const style = new Style({
      fill: new Fill({ color: '#404040' }),
      stroke: new Stroke({ color: '#151515', width: 1.5 })
    });

    return style;
  }

  private getViewForMap(): View {
    const projection = getProjection('EPSG:4326');
    const projectionExtent = projection.getExtent();
    const projectionCenter = [0, 50];
    const view = new View({
      projection: projection,
      center: projectionCenter,
      zoom: 0,
      extent: projectionExtent,
      multiWorld: false,
      smoothExtentConstraint: false
    });

    return view;
  }

  private colorPolygonsByValues(): void {
    const actualDataValues = Array.from(new Set(this.featuresWithData.map(item => item.getProperties()['actualData']?.cases).filter(item => item)));
    this.colorBreaks = this.getClassificationBreaks(actualDataValues);

    this.vectorSource.forEachFeature(item => {
      item.setStyle(new Style({ fill: new Fill({ color: this.getColor(item) }), stroke: new Stroke({ width: 1 }) }))
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
