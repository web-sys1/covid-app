import { Component, OnInit } from '@angular/core';
import { CountryCovidData } from './models/countryCovidData.model';
import { CountryCovidDataWithTimeline } from './models/countryCovidDataWithTimeline.model';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public data = new Array<CountryCovidData>();
  public timelineData = new Array<CountryCovidDataWithTimeline>();
  public mapSize = 3;
  public countriesTileSize = 1;

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.init();
    this.mapSize = (window.innerWidth <= 1100) ? 4 : 3;
    this.countriesTileSize = (window.innerWidth <= 1100) ? 2 : 1;
  }

  public onResize(event): void {
    this.mapSize = (event.target.innerWidth <= 1100) ? 4 : 3;
    this.countriesTileSize = (window.innerWidth <= 1100) ? 2 : 1;
  }

}
