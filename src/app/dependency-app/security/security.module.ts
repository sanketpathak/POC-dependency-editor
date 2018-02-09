import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserModule } from '@angular/platform-browser';

import { SecurityComponent } from './security.component';
import { IssueModule } from '../issue/issue.module';
import { AlertBoxModule } from '../alert-box/alert-box.module';

@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    TagInputModule,
    BrowserModule,
    IssueModule,
    AlertBoxModule
],
 declarations: [
    SecurityComponent
],
 exports: [
    SecurityComponent,
],
 providers: [],
})
export class SecurityModule { }
