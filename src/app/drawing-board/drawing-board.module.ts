import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrawingBoardComponent } from './drawing-board.component';

@NgModule ({
    imports: [
        CommonModule
    ],
    declarations: [
        DrawingBoardComponent
    ],
    exports: [
        DrawingBoardComponent
    ]
})

export class DrawingBoardModule {}
