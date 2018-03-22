import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap';

import { ListElementComponent } from './list-element.component';


@NgModule({
 imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    TooltipModule.forRoot()
],
 declarations: [
    ListElementComponent
],
 exports: [
    ListElementComponent
],
    providers: []
})
export class ListElementModule {}
