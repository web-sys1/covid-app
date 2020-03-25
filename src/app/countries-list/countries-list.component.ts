import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  private countriesSource: any[];
  public countries: any[];
  public options = {
    autoHide: false,
    classNames: {
      scrollbar: 'simplebar-scrollbar',
    }
  }

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.subscription = this.dataService.$featuresWithData.subscribe((result) => {
      this.countriesSource = result;
      this.countries = this.countriesSource.slice();
    })
  }

  filterCountries(value: string) {
    this.countries = this.countriesSource.filter(item => item.values_.name.toLowerCase().indexOf(value.toLowerCase()) > -1 )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}