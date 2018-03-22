import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { SecurityComponent } from './security.component';
import { AlertBoxModule } from '../alert-box/alert-box.module';

@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    AlertBoxModule
],
 declarations: [
    SecurityComponent
],
 exports: [
    SecurityComponent
],
    providers: []
})
export class SecurityModule {}
