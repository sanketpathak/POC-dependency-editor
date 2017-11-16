import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NaturalLanguageComponent } from './natural-language.component';

@NgModule ({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        NaturalLanguageComponent
    ],
    exports: [
        NaturalLanguageComponent
    ]
})

export class NaturalLanguageModule {}
