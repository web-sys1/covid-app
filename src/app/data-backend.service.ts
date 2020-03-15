import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DataBackendService {
    constructor(private http: HttpClient) { }

    public getCovidData(): Observable<any> {
        return this.http.get('/web/koronawirus/wykaz-zarazen-koronawirusem-sars-cov-2', { responseType: 'text' }).pipe(
            map((response) => {
                if (response)
                    return JSON.parse(response
                        .substring(response.indexOf("[{"), response.indexOf("}]") + 2)
                        .replace(/\\/g, ""));
            })
        );
    }
}