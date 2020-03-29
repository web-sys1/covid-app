import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { Feature } from 'ol';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-countries-list',
  templateUrl: './countries-list.component.html',
  styleUrls: ['./countries-list.component.scss']
})
export class CountriesListComponent implements OnInit, OnDestroy {

  @ViewChild(MatRipple) firstCountryRippleElement: MatRipple;
  
  private subscription: Subscription;
  private countriesSource: Feature[];
  public countries: Feature[];
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
    this.countries = this.countriesSource.filter(item => item.getProperties()["name"].toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  selectFirstCountryOnEnter(event: KeyboardEvent) {
    if (event.keyCode == 13) {
      event.preventDefault();
      this.firstCountryRippleElement.launch({ centered: true });
      this.animateToFeature(this.countries[0]);
    }
  }

  animateToFeature(feature: Feature) {
    this.dataService.zoomAndPanToFeature(feature);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}