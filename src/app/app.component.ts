import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  public data = new Array<any>();
  public mapSize = 3;
  public countriesTileSize = 1;

  constructor(private dataService: DataService) {
    this.subscriptions.add(this.dataService.$covidData.subscribe((result) => {
      this.data = result;
    }))
  }

  ngOnInit(): void {
    this.mapSize = (window.innerWidth <= 1100) ? 4 : 3;
    this.countriesTileSize = (window.innerWidth <= 1100) ? 2 : 1;
    this.dataService.init();
  }

  public onResize(event): void {
    this.mapSize = (event.target.innerWidth <= 1100) ? 4 : 3;
    this.countriesTileSize = (window.innerWidth <= 1100) ? 2 : 1;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
}
