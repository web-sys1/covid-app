import { Component, OnInit } from '@angular/core';
import { TopojsonService } from '../services/topojson.service';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit {
  public countries: any[];
  public options = {
    autoHide: false,
    classNames: {
      scrollbar: 'simplebar-scrollbar',
    }
  }

  constructor(private topojsonService: TopojsonService) {
    this.countries = this.topojsonService.getCountries(); 
  }

  ngOnInit(): void {
  }

}