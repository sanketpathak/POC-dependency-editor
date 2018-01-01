import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
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
  @Input('mygui') appName: string;

  public donutData: any;
  public showtd = false;
  public symbol = 'fa fa-sort-desc';
  public showOnScreen = true;
  public stackLevelLicense: string;
  public r_l: number;
  public moreInfoText = '';
  public cve = 0;
  public dep: Array<any> = [];
  public securityConflicts: Array<any>;
  public isSecurityIssueVar = '';
  public allLicenses: Array<any> = [];
  public licenseCount = {};
  public licenseData = [];
  public ecosystem = 'maven';
  public title: string;
  public isNode = true;
  public runTimeIcon = '🆁';
  public testIcon = '🆃';
  public iconImage: string;
  public selectedComp = new Set();
  public compDep = new Set();
  public charts: any = {};
  status: any = {
    isFirstOpen: true,
    isFirstDisabled: false
  };

  public isSecurityIssue(): void {
    this.isSecurityIssueVar = '';
    this.cve = 0;
    if (this.dependencies) {
      this.dependencies['dependencies'].forEach(d => {
        if (this.securityConflicts.indexOf(d.name) !== -1) {
          this.isSecurityIssueVar = d.name;
          this.cve += 1;
        }
      });
    }
  }
  constructor(private applicationServices: ApplicationServices) {}

  public cveDesc() {
    this.moreInfoText = 'some description of CVE';
  }

  public addItem(dependency): void {
    if (this.dependencies) {
      this.dependencies.companionPackages.delete(dependency);
      this.dependencies.dependencies.add(dependency);
    } else {
      this.compDep.delete(dependency);
      this.selectedComp.add(dependency);
    }
    this.licenseChange();
  }

  public processInit() {
    const config: Observable<any> = this.applicationServices.intialConfig(
      this.ecosystem
    );
    config.subscribe(data => {
      if (data) {
        this.title = data[this.ecosystem]['title'];
        this.stackLevelLicense = data[this.ecosystem]['stackLevelLicense'];
        this.securityConflicts = data[this.ecosystem]['securityConflicts'];
        this.iconImage = data[this.ecosystem]['iconImage'];
        data[this.ecosystem]['compDep'].forEach(element => {
          this.compDep.add(element);
        });
      }
    });
  }
  public processPackages(): void {
    const packageInfo: Observable<any> = this.applicationServices.getPackages(
      this.ecosystem
    );
    packageInfo.subscribe(data => {
      if (data) {
        this.dep = data['dependencies'];
        data['dependencies'].map(d => {
          this.allLicenses = this.allLicenses.concat(
            this.filterLicenses(d['licenses'])
          );
        });
        this.allLicenses.forEach(item => {
          this.licenseCount[item] = (this.licenseCount[item] || 0) + 1;
        });
        Object.keys(this.licenseCount).forEach(k => {
          this.licenseData.push([
            k,
            this.licenseCount[k] * 100 / this.allLicenses.length
          ]);
        });
      }
      this.displayLicenses();
    });
  }

  public displayLicenses(): void {
    this.charts['data'] = {
      columns: this.licenseData,
      type: 'donut'
    };
    this.charts['options'] = {
      donut: {
        title: this.licenseData.length + ' Licenses',
        width: 12,
        label: {
          format: function(value) {
            return;
          }
        }
      },
      size: {
        height: 200,
        width: 225
      }
    };
    this.charts['configs'] = {
      legend: {
        show: true,
        position: 'right'
      }
    };
  }

  ngOnInit() {
    this.processInit();
    this.processPackages();
    this.displayLicenses();
    if (this.appName) {
      if (this.appName.toLocaleLowerCase().indexOf('node') !== -1) {
        this.ecosystem = 'node';
      } else {
        this.ecosystem = 'maven';
      }
    }
  }

  public emitCloseEvent(element: Element): void {
    this.showOnScreen = false;
    this.onCloseEmitter.emit([this.component, element]);
  }

  private toggle() {
    this.showtd = !this.showtd;
    if (this.showtd === true) {
      this.symbol = 'fa fa-sort-asc nom';
    } else {
      this.symbol = 'fa fa-sort-desc nom';
    }
  }

  public filterLicenses(licenses: Array<any>) {
    const resultArray: Array<any> = [];
    licenses.forEach(i => {
      resultArray.push(
        i
          .replace('or later', '')
          .replace('New', '')
          .trim()
      );
    });
    return resultArray;
  }

  public licenseChange() {
    if (this.dep) {
      this.allLicenses = [];
      this.licenseCount = {};
      this.licenseData = [];
      this.dep.map(d => {
        this.allLicenses = this.allLicenses.concat(
          this.filterLicenses(d['licenses'])
        );
      });
      if (this.dependencies) {
        console.log(this.dependencies);
        this.dependencies['dependencies'].forEach(d => {
          this.allLicenses = this.allLicenses.concat(
            this.filterLicenses(d['licenses'])
          );
        });
      }
      this.allLicenses.forEach(item => {
        this.licenseCount[item] = (this.licenseCount[item] || 0) + 1;
      });
      Object.keys(this.licenseCount).forEach(k => {
        this.licenseData.push([
          k,
          this.licenseCount[k] * 100 / this.allLicenses.length
        ]);
      });
      this.displayLicenses();
    }
  }
  ngOnChanges(): void {
    this.licenseChange();
    this.isSecurityIssue();
  }
}
