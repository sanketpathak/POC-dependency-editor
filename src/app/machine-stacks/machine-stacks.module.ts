import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NaturalLanguageModule } from '../natural-language/natural-language.module';
import { DrawingBoardModule } from '../drawing-board/drawing-board.module';

import { MachineStacksComponent } from './machine-stacks.component';

@NgModule ({
    imports: [
        CommonModule,
        DrawingBoardModule,
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
