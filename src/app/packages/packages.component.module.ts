import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypeaheadModule} from 'ngx-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap';
import { AccordionModule } from 'ngx-bootstrap';



import { PackagesComponent } from './packages.component';
import { ApplicationModule } from '../application/application.module';

@NgModule ({
    imports: [
        CommonModule,
        FormsModule,
        TypeaheadModule.forRoot(),
        BsDropdownModule.forRoot(),
        AccordionModule
    ],
    declarations: [
        PackagesComponent
    ],
    exports: [
        PackagesComponent
    ]
})

export class PackagesModule {}
