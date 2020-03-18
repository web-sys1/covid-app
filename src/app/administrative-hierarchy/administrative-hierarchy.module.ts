import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimplebarAngularModule } from 'simplebar-angular';
import { AngularMaterialModule } from '../angular-material.module';
import { AdministrativeHierarchyComponent } from './administrative-hierarchy.component';
import { AdministrativeHierarchyService } from './administrative-hierarchy.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    SimplebarAngularModule
  ],
  declarations: [
    AdministrativeHierarchyComponent
  ],
  exports: [
    AdministrativeHierarchyComponent
  ],
  providers: [AdministrativeHierarchyService],
})
export class AdministrativeHierarchyModule { }
