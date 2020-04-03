import { Injectable } from "@angular/core";
import { Feature } from 'ol';
import TopoJSON from 'ol/format/TopoJSON';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { CountryCovidData } from '../models/countryCovidData.model';
import { CountryCovidDataWithTimeline } from '../models/countryCovidDataWithTimeline.model';
import _dataFeatures from '../_administrative-data/europe_topo.json';
import { DataBackendService } from './data-backend.service';



@Injectable()
export class DataService {
    private data = new Array<CountryCovidData>();
    private timelineData = new Array<CountryCovidDataWithTimeline>();
    private featuresWithData: Feature[];
    private initSubscription: Subscription;

    private featuresWithDataSource = new Subject<Feature[]>()
    public $featuresWithData = this.featuresWithDataSource.asObservable();

    private featureClickedSource = new Subject<Feature>()
    public $featureClicked = this.featureClickedSource.asObservable();

    private isLoadingSource = new Subject<boolean>()
    public $isLoading = this.isLoadingSource.asObservable();


    constructor(private dataBackendService: DataBackendService) {
    }

    public init(): void {
        this.isLoadingSource.next(true);
        this.initSubscription = forkJoin(
            this.dataBackendService.getHistoricalCovidData(),
            this.dataBackendService.getActualCovidDate()
        ).subscribe(result => {
            this.timelineData = result[0];
            this.data = result[1];
            this.generateFeaturesWithCovidData();
            this.isLoadingSource.next(false);
        })
    }

    private generateFeaturesWithCovidData() {
        const features = new TopoJSON().readFeatures(_dataFeatures);
        features.forEach(feature => {
            const foundCountryData = this.data.find(item => feature.getProperties()["iso_a3"] == item.countryInfo.iso3);
            const foundTimelineData = this.timelineData.find(item => item.country.toLowerCase() == foundCountryData?.country.toLowerCase());
            const featureProperties = feature.getProperties();
            const featureId = Number.parseInt((<any>feature).ol_uid);
            featureProperties["actualData"] = foundCountryData;
            featureProperties["timelineData"] = foundTimelineData;
            feature.setProperties(featureProperties);
            feature.setId(featureId);
            // if(!foundCountryData || !foundTimelineData) 
            //     console.log(feature.getProperties()['name'])
        });

        features.sort((a, b) => (a.getProperties()["name"] > b.getProperties()["name"]) ? 1 : ((b.getProperties()["name"] > a.getProperties()["name"]) ? -1 : 0));

        this.featuresWithData = features;
        this.featuresWithDataSource.next(features);
    }

    public zoomAndPanToFeature(feature: Feature) {
        this.featureClickedSource.next(feature);
    }

    ngOnDestroy(): void {
        this.initSubscription.unsubscribe();
    }
}