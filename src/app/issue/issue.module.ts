import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    AccordionModule
} from 'ngx-bootstrap';
import {
    HttpModule
} from '@angular/http';
import {
    FormsModule
} from '@angular/forms';

import {
    IssueComponent
} from './issue.component';

@NgModule({
    imports: [
        CommonModule,
        AccordionModule.forRoot(),
        HttpModule,
        FormsModule,
    ],
    declarations: [
        IssueComponent
    ],
    exports: [
        IssueComponent,
    ],
    providers: [],
})
export class IssueModule {}
