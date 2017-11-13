import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaturalLanguageComponent } from './natural-language.component';

@NgModule ({
    imports: [
        CommonModule
    ],
    declarations: [
        NaturalLanguageComponent
    ],
    exports: [
        NaturalLanguageComponent
    ]
})

export class NaturalLanguageModule {}
