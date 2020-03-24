import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AngularMaterialModule } from '../angular-material.module';
import { CountriesListComponent } from './countries-list.component';
import { CountriesListService } from './countries-list.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    SimplebarAngularModule
  ],
  declarations: [
    CountriesListComponent
  ],
  exports: [
    CountriesListComponent
  ],
  providers: [CountriesListService],
})
export class CountriesListModule { }
