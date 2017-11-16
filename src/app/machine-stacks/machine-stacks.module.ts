import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaturalLanguageModule } from '../natural-language/natural-language.module';

import { MachineStacksComponent } from './machine-stacks.component';

@NgModule ({
    imports: [
        CommonModule,
        NaturalLanguageModule
    ],
    declarations: [
        MachineStacksComponent
    ],
    exports: [
        MachineStacksComponent
    ]
})

export class MachineStacksModule {}
