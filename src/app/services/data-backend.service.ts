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
        // response.find(item => item.country?.toLowerCase() == "bosnia").country = "Bosnia and Herzegovina";
        response.find(item => item.province?.toLowerCase() == "faroe islands").country = "Faroe Islands";
        response.find(item => item.province?.toLowerCase() == "gibraltar").country = "Gibraltar";
        response.find(item => item.province?.toLowerCase() == "isle of man").country = "Isle of Man";
        // response.find(item => item.country?.toLowerCase() == "moldova, republic of").country = "Moldova";
        // response.find(item => item.country?.toLowerCase() == "macedonia").country = "North Macedonia";
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