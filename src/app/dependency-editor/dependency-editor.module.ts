import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PackagesModule} from '../packages/packages.component.module';
import {ApplicationModule} from '../application/application.module';

import { DependencyComponent } from './dependency-editor.component';
import { PackagesComponent } from '../packages/packages.component';

@NgModule ({
    imports: [
        CommonModule,
        PackagesModule,
        ApplicationModule
    ],
    declarations: [
        DependencyComponent
    ],
    exports: [
        DependencyComponent,
        PackagesModule,
        ApplicationModule
    ]
})

export class DependencyModule {}
