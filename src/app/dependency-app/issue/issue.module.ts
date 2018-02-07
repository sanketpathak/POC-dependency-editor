import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserModule } from '@angular/platform-browser';

import { IssueComponent } from './issue.component';
// import { LicenseModule } from './license/license.module';
// import { SecurityModule } from './security/security.module';

@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    TagInputModule,
    BrowserModule,
    // LicenseModule,
    // SecurityModule
],
 declarations: [
    IssueComponent
],
 exports: [
    IssueComponent,
    
],
 providers: [],
})
export class IssueModule { }
