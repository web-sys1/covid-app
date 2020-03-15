import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { DataBackendService } from './data-backend.service';
import { AdministrativeItem } from './models/administrativeItem.model';

//local data import
import level1AdministrativeData from './_administrative-data/level1.json';
import level2AdministrativeData from './_administrative-data/level2.json';
import topoFeatures from './_administrative-data/topoFeatures.json';


@Injectable()
export class DataService {
    private data = new Array<any>();

    private level1Data: AdministrativeItem[] = level1AdministrativeData;
    private level2Data: AdministrativeItem[] = level2AdministrativeData;
    private topojsonObject = topoFeatures;

    private covidDataSource = new Subject<any[]>();
    public $covidData = this.covidDataSource.asObservable();

    constructor(private dataBackendService: DataBackendService) {
    }

    public init() {
        this.dataBackendService.getCovidData().subscribe(data => {
            this.data = data;
            this.covidDataSource.next(data);
        });
    }
}