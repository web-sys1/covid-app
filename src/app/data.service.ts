import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable()
export class DataService {

    private covidDataSource = new Subject<any>();
    public $covidData = this.covidDataSource.asObservable();

    constructor(private http: HttpClient) { }

    public init() {
        this.http.get('/web/koronawirus/wykaz-zarazen-koronawirusem-sars-cov-2', { responseType: 'text' }).subscribe(data => {
            const parsedData = JSON.parse(data.substring(data.indexOf("[{"), data.indexOf("}]") + 2).replace(/\\/g, ""));
            const sum = parsedData.map(item => Number.parseInt(item.Liczba)).reduce((a, b) => a + b, 0);
            console.log(sum);
            this.covidDataSource.next(parsedData);
        });
    }
}