import { Injectable } from "@angular/core";
import { Feature } from 'ol';
import TopoJSON from 'ol/format/TopoJSON';
import VectorSource from 'ol/source/Vector';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { CountryCovidData } from '../models/countryCovidData.model';
import { CountryCovidDataWithTimeline } from '../models/countryCovidDataWithTimeline.model';
import _dataFeatures from '../_administrative-data/geoWorld.json';
import { DataBackendService } from './data-backend.service';



@Injectable()
export class DataService {
    private actualData = new Array<CountryCovidData>();
    private timelineData = new Array<CountryCovidDataWithTimeline>();
    private featuresWithData: Feature[];
    private initSubscription: Subscription;

    private featuresWithDataSource = new Subject<Feature[]>()
    public $featuresWithData = this.featuresWithDataSource.asObservable();

    private featureClickedSource = new Subject<Feature>()
    public $featureClicked = this.featureClickedSource.asObservable();

    private dataLoadedSource = new Subject<boolean>()
    public $dataLoaded = this.dataLoadedSource.asObservable();


    constructor(private dataBackendService: DataBackendService) {
    }

    public init(): void {
        this.initSubscription = forkJoin(
            this.dataBackendService.getHistoricalCovidData(),
            this.dataBackendService.getActualCovidDate()
        ).subscribe(result => {
            this.timelineData = result[0];
            this.actualData = result[1];
            this.generateFeaturesWithCovidData();
            this.dataLoadedSource.next(true);
        })
    }

    private generateFeaturesWithCovidData() {
        const sourceFeatures = new TopoJSON().readFeatures(_dataFeatures);
        const vectorSource = new VectorSource({
            features: sourceFeatures
        });

        this.actualData.forEach(item => {
            const foundFeatures = vectorSource.getFeaturesAtCoordinate([item?.countryInfo?.long, item?.countryInfo?.lat]);
            if (foundFeatures && foundFeatures.length > 0) {
                const feature = foundFeatures[0];
                const foundTimelineData = this.timelineData.find(timeline => timeline?.country?.toLowerCase() == item?.country?.toLowerCase() || timeline?.province?.toLowerCase() == item?.country?.toLowerCase());
                const featureProperties = feature.getProperties();
                const featureId = Number.parseInt((<any>feature).ol_uid);
                featureProperties["actualData"] = item;
                featureProperties["timelineData"] = foundTimelineData;
                feature.setProperties(featureProperties);
                feature.setId(featureId);
            }
        });

        const changedFeatures = vectorSource.getFeatures();
        changedFeatures.sort((a, b) => (a.getProperties()["name"] > b.getProperties()["name"]) ? 1 : ((b.getProperties()["name"] > a.getProperties()["name"]) ? -1 : 0));

        this.featuresWithData = changedFeatures;
        this.featuresWithDataSource.next(changedFeatures);
    }

    public zoomAndPanToFeature(feature: Feature) {
        this.featureClickedSource.next(feature);
    }

    ngOnDestroy(): void {
        this.initSubscription.unsubscribe();
    }
}