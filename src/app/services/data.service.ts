import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { DataBackendService } from './data-backend.service';



@Injectable()
export class DataService {
    private data = new Array<any>();

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