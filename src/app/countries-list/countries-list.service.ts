import { Injectable } from "@angular/core";
import { TopojsonService } from '../services/topojson.service';


@Injectable()
export class CountriesListService {

    constructor(private topojsonService: TopojsonService) { }

}