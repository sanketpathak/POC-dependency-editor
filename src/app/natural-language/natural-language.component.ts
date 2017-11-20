import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { NaturalLanguageService } from './natural-language.service';
import { DependencyCheckService } from './dependency-check.service';

@Component ({
    selector: 'natural-language',
    styleUrls: ['./natural-language.component.less'],
    providers: [NaturalLanguageService, DependencyCheckService],
    templateUrl: './natural-language.component.html'
})

export class NaturalLanguageComponent implements OnInit {
    public userInput: string;
    public dependencies: Array<any> = [];

    public counter: Array<number> = [];

    public addMore = false;
    public inputs: Array<string> = [];

    constructor(private naturalLanguageService: NaturalLanguageService, 
                private dependencyCheckService: DependencyCheckService) {}

    processNaturalLanguage(): void {
        let naturalLanguage: Observable<any> = this.naturalLanguageService.getPackages(this.userInput);
        naturalLanguage.subscribe((data) => {
            console.log(data);
            if (data) {
                this.dependencies = data['dependencies'];
            }
        });
    }

    handleAddMore(): void {
        if (this.inputs && this.inputs.length > 0) {
            let dep: Observable<any> = this.dependencyCheckService.checkPackages(this.inputs);
            dep.subscribe((data) => {
                if (data) {
                    if (data['validation'] && data['validation'].length > 0) {
                        this.dependencies.push(...data['validation']);
                    }
                }
            });
        }
    }

    ngOnInit(): void {
        
    }

}
