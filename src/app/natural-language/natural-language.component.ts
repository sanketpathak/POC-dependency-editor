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

    public tags = '';
    public addTag = false;

    constructor(private naturalLanguageService: NaturalLanguageService, 
                private dependencyCheckService: DependencyCheckService) {}

    processNaturalLanguage(): void {
        let naturalLanguage: Observable<any> = this.naturalLanguageService.getPackages(this.userInput);
        naturalLanguage.subscribe((data) => {
            console.log(data);
            if (data) {
                data['dependencies'].map((d) => d['checked'] = true);
                this.dependencies = data['dependencies'];
            }
        });
    }

    handleAddMore(): void {
        if (this.inputs && this.inputs.length > 0) {
            const dep: Observable<any> = this.dependencyCheckService.checkPackages(this.inputs);
            dep.subscribe((data) => {
                if (data) {
                    if (data['validation'] && data['validation'].length > 0) {
                        data['validation'].map((d) => d['checked'] = false);
                        this.dependencies.push(...data['validation']);
                    }
                }
            });
        }
    }

    handleSubmit(): void {
        if (this.dependencies && this.dependencies.length > 0) {
            const final: Array<any> = this.dependencies.filter((d) => d['checked'] === true);
            console.log(final);
        }
    }

    handleAddTag(): void {
        if (this.tags) {
            const dep: Observable<any> = this.dependencyCheckService.findByTag(this.tags);
            dep.subscribe((data) => {
                if (data) {
                    if (data['dependencies'] && data['dependencies'].length > 0) {
                        data['dependencies'].map((d) => d['checked'] = false);
                        this.dependencies.push(...data['dependencies']);
                    }
                }
            });
        }
    }

    ngOnInit(): void {
        
    }

}
