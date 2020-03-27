import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CountryCovidData } from '../models/countryCovidData.model';
import { CountryCovidDataWithTimeline, TimelineCovidData } from '../models/countryCovidDataWithTimeline.model';

const sourceUrl = 'https://corona.lmao.ninja/';

@Injectable()
export class DataBackendService {

    constructor(private http: HttpClient) { }


    public getActualCovidDate(): Observable<CountryCovidData[]> {
        return this.http.get(`${sourceUrl}countries`).pipe(map((response) => {
            return <CountryCovidData[]>response;
        }))
    }

    public getHistoricalCovidData(): Observable<CountryCovidDataWithTimeline[]> {
        return this.http.get(`${sourceUrl}v2/historical`).pipe(map((response) => {
            this.fixMissingHistoricalNames(response);
            return this.getAdaptedHistoricalCovidData(response);
        }))
    }

    private fixMissingHistoricalNames(response: any) {
        response.find(item => item.province == "faroe islands").country = "Faroe Islands";
        response.find(item => item.province == "gibraltar").country = "Gibraltar";
        response.find(item => item.country == "moldova").country = "Moldova, Republic of";
        response.find(item => item.country == "north macedonia").country = "Macedonia, the former Yugoslav Republic of";
        response.find(item => item.province == "isle of man").country = "Isle of Man";
    }

    private getAdaptedHistoricalCovidData(response: any): CountryCovidDataWithTimeline[] {
        const adaptedHistoricalData = new Array<CountryCovidDataWithTimeline>();
        response.forEach(item => {
            const adaptedItem = new CountryCovidDataWithTimeline();
            adaptedItem.country = item.country;
            adaptedItem.province = item.province;
            adaptedItem.timeline = new Array<TimelineCovidData>();
            for (let key in item.timeline?.cases) {
                const timelineData = new TimelineCovidData();
                timelineData.date = new Date(key);
                timelineData.cases = item.timeline.cases[key];
                timelineData.deaths = item.timeline.deaths[key];
                adaptedItem.timeline.push(timelineData);
            }
            adaptedHistoricalData.push(adaptedItem);
        });

        return adaptedHistoricalData;
    }
}