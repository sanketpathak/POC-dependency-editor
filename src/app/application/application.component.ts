import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApplicationServices } from './application.component.service';
// import { BrowserModule } from '@angular/platform-browser';
import * as c3 from 'c3';


@Component({
    selector: 'app-application',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./application.component.less'],
    providers: [ApplicationServices],
    templateUrl: './application.component.html'

})
export class ApplicationComponent implements OnInit, OnChanges {
    @Input('component') component;
    @Output() onCloseEmitter = new EventEmitter();

    @Input('dependencies') dependencies;


    public donutData: any;
    public showtd: boolean = false;
    public symbol: string = 'fa fa-sort-desc';
    public showOnScreen: boolean = true;
    public l1: string;
    public l2: string;
    public l3: string;
    public rel: string = "lgplv3+";
    public r_l:number;
    public moreInfoText: string = "";
    public cve=0;
    public dep: Array<any> = [];
    public securityConflicts = ["aws-maven"];
    public isSecurityIssueVar:string  = '';
    public allLicenses:Array<any> = [];
    public licenseCount = {};
    public licenseData = [];



    public compDep = new Set();

    public charts: any = {};

    public isSecurityIssue(): void {
        this.isSecurityIssueVar = '';            
        if(this.dependencies)
        this.dependencies['dependencies'].forEach((d) => {
            if (this.securityConflicts.indexOf(d.name) !== -1){
                this.isSecurityIssueVar = d.name;      
                this.cve = 1;       
            }
        })
    }
    constructor(private applicationServices: ApplicationServices) { }

    status: any = {
        isFirstOpen: true,
        isFirstDisabled: false
    };

    public moreInfo() {
        this.moreInfoText = "some description of CVE";
    }

    public addItem(dependency):void{
        if(this.dependencies){
            this.dependencies.companionPackages.delete(dependency);
            this.dependencies.dependencies.add(dependency);
        }else {
            this.compDep.delete(dependency);
            this.dependencies.dependencies.add(dependency);
        }
    }


    public processPackages(): void {
        const packageInfo: Observable<any> = this.applicationServices.getPackages();
        packageInfo.subscribe((data) => {
            if (data) {
                this.dep = data['dependencies'];
                data['dependencies'].map((d) => {
                    this.allLicenses = this.allLicenses.concat(this.filterLicenses(d['licenses'])); 
                });
                this.allLicenses.forEach((item) => {
                    this.licenseCount[item] = ( this.licenseCount[item] || 0 ) + 1;
                });
                Object.keys(this.licenseCount).forEach((k) => {
                    this.licenseData.push([k,  (this.licenseCount[k] * 100)/this.allLicenses.length]);
                });
            }
            this.displayLicenses();
        });
    }

    public displayLicenses(): void{
        this.charts['data'] = {
            columns: this.licenseData,
            type : 'donut'
        };
        this.charts['options'] = {
            donut: {
                title: this.licenseData.length + " Licenses",
                width: 12,
                label:{
                    format: function (value) { return value; }
                }
            },
            size: {
                height:200,
                width :225
            }	

        };
        this.charts['configs'] = {
            legend: {
                show: true,
                position: 'right'
            },
        };

    }

    ngOnInit() {
        this.processPackages();
        this.compDep.add({"name": "A", "latest_version": "2.6.0"});
        this.compDep.add({"name": "B", "latest_version":"1.3.4"});  
        this.displayLicenses();
    }

    public emitCloseEvent(element: Element): void {
        this.showOnScreen = false;
        this.onCloseEmitter.emit([this.component, element]);
    }

    private toggle() {
        this.showtd = !this.showtd;
        if (this.showtd === true) {
            this.symbol = 'fa fa-sort-asc nom';
        }
        else {
            this.symbol = 'fa fa-sort-desc nom';
        }
    }

    public filterLicenses(licenses: Array<any>){
        let resultArray: Array<any> = [];
        licenses.forEach((i) => {
            resultArray.push(i.replace("or later", "").replace("New", "").trim());
        })
        return resultArray;
    }

    ngOnChanges(): void {
        if(this.dep){
            this.allLicenses = [];
            this.licenseCount = {};
            this.licenseData = [];
            this.dep.map((d) => {
                this.allLicenses = this.allLicenses.concat(this.filterLicenses(d['licenses'])); 
            });
            if(this.dependencies){
                console.log(this.dependencies);
                this.dependencies['dependencies'].forEach((d) => {
                    console.log(d);
                    this.allLicenses = this.allLicenses.concat(this.filterLicenses(d['licenses'])); 
                });
            }
            this.allLicenses.forEach((item) => {
                this.licenseCount[item] = ( this.licenseCount[item] || 0 ) + 1;
            });
            Object.keys(this.licenseCount).forEach((k) => {
                this.licenseData.push([k, (this.licenseCount[k] * 100) / this.allLicenses.length]);
            });
            this.displayLicenses();
        }
    }
}
