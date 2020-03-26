import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountriesListComponent } from './countries-list/countries-list.component';
import { MapComponent } from './map/map.component';
import { DataBackendService } from './services/data-backend.service';
import { DataService } from './services/data.service';


@NgModule({
  declarations: [
    AppComponent,
    CountriesListComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    SimplebarAngularModule,
    NgxSpinnerModule
  ],
  providers: [DataService, DataBackendService],
  bootstrap: [AppComponent]
})
export class AppModule { }
