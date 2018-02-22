import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { SecurityModule } from '../security/security.module';
import { LicenseModule } from '../license/license.module';
import { CurrentprojectComponent } from './current-project.component';


@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    SecurityModule,
    LicenseModule
],
 declarations: [
    CurrentprojectComponent
],
 exports: [
    CurrentprojectComponent
],
    providers: []
})
export class CurrentprojectModule { }
