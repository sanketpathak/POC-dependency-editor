import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
// import { BrowserModule } from '@angular/platform-browser';


import { ApplicationComponent } from './application.component';
import {ChartModule} from '../utils/chart/chart.module' ;


@NgModule({
 imports: [
    ChartModule,
    CommonModule,
    AccordionModule.forRoot(),
    // BrowserModule,
    HttpModule
],
 declarations: [
  ApplicationComponent
],
 exports: [
  ApplicationComponent
],
 providers: [],
})
export class ApplicationModule { }
