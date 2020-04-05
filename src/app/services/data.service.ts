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

    private generateFeaturesWithCovidData(): void {
        const sourceFeatures = new TopoJSON().readFeatures(_dataFeatures);
        const vectorSource = new VectorSource({
            features: sourceFeatures
        });
        const vectorFeatures = vectorSource.getFeatures();

        const notFoundCountries: CountryCovidData[] = [];
        this.actualData.forEach(item => {
            let foundFeature = vectorFeatures.find(
                feature => feature.getProperties()['iso_a3'] == item.countryInfo?.iso3
                    || feature.getProperties()['gu_a3'] == item.countryInfo?.iso3
                    || feature.getProperties()['name']?.toLowerCase() == item.country?.toLowerCase()
                    || feature.getProperties()['name_long']?.toLowerCase() == item.country?.toLowerCase()
            );

            if (foundFeature)
                this.assignCountryDataToFeature(item, foundFeature);
            else
                notFoundCountries.push(item);
        });

        notFoundCountries.forEach(item => {
            const foundFeature = vectorSource.getFeaturesAtCoordinate([item.countryInfo?.long, item.countryInfo?.lat])[0];
            if (foundFeature && !foundFeature.getProperties()['actualData'])
                this.assignCountryDataToFeature(item, foundFeature, true);
        });

        const changedFeatures = vectorSource.getFeatures();
        changedFeatures.sort((a, b) => (a.getProperties()["name"] > b.getProperties()["name"]) ? 1 : ((b.getProperties()["name"] > a.getProperties()["name"]) ? -1 : 0));

        this.featuresWithData = changedFeatures;
        this.featuresWithDataSource.next(changedFeatures);
    }

    private assignCountryDataToFeature(countryItem: CountryCovidData, foundFeature: Feature, assignName: boolean = false) {
        const featureProperties = foundFeature.getProperties();
        const featureId = Number.parseInt((<any>foundFeature).ol_uid);
        const foundTimelineData = this.timelineData.find(
            timeline => timeline.country?.toLowerCase() == countryItem.country?.toLowerCase()
                || timeline.province?.toLowerCase() == countryItem.country?.toLowerCase()
        );
        featureProperties['actualData'] = countryItem;
        featureProperties['timelineData'] = foundTimelineData;
        if (assignName) {
            featureProperties['name'] = countryItem.country;
            featureProperties['name_long'] = countryItem.country;
            featureProperties['iso_a3'] = countryItem.countryInfo.iso3;
        }
        foundFeature.setProperties(featureProperties);
        foundFeature.setId(featureId);
    }

    public zoomAndPanToFeature(feature: Feature) {
        this.featureClickedSource.next(feature);
    }

    ngOnDestroy(): void {
        this.initSubscription.unsubscribe();
    }
}