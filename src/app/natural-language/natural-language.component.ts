import { Component } from '@angular/core';

import { NaturalLanguageService } from './natural-language.service';

@Component ({
    selector: 'natural-language',
    templateUrl: './natural-language.component.html',
    styleUrls: ['./natural-language.component.less'],
    providers: [NaturalLanguageService]
})

export class NaturalLanguageComponent {
    public userInput: string;

    constructor(private naturalLanguageService: NaturalLanguageService) {}

}
