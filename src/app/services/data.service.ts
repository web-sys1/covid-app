import { Injectable } from "@angular/core";
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
    private featuresWithData;
    private initSubscription: Subscription;

    private featuresWithDataSource = new Subject<any>()
    public $featuresWithData = this.featuresWithDataSource.asObservable();

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
        const features = (new TopoJSON()).readFeatures(_dataFeatures);
        features.forEach(feature => {
          const foundCountryData = this.data.find(item => feature.values_.iso_a3 == item.countryInfo.iso3);
          const foundTimelineData = this.timelineData.find(item => item.country.toLowerCase() == foundCountryData?.country.toLowerCase());
          feature.values_.actualData = foundCountryData;
          feature.values_.timelineData = foundTimelineData;
        });

        this.featuresWithData = features;
        this.featuresWithDataSource.next(features);
      }

    ngOnDestroy(): void {
        this.initSubscription.unsubscribe();
    }
}