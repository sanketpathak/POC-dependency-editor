import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import {
  StackLicenseAnalysisModel,
  LicenseStackAnalysisModel,
  BoosterInfo
} from '../model/data.model';
import {
  AlertBoxComponent
} from '../alert-box/alert-box.component';

@Component({
  selector: 'app-license',
  styleUrls: ['./license.component.less'],
  templateUrl: './license.component.html'
})

export class LicenseComponent implements OnInit, OnChanges {
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() lisData: LicenseStackAnalysisModel;
  @Input() allLicenses: Array < any > = [];
  @Input() boosterInfo: BoosterInfo;
  @ViewChild(AlertBoxComponent) alertBoxComponent: AlertBoxComponent;

  public title = 'License';
  public icon = 'pficon pficon-on-running';
  public stackLicense: string;
  public stackStatus: string;
  public hasIssue: boolean | string = false;
  public responseReady = false;
  public toHave = false;
  public licenseAll: Array < string > = [];
  public licenseIssue = true;
  public licenseDt: Array < any > = [];
  public licenseCount: any = {};
  public liData: Array<any> = [];
  public charts: any = {};


  constructor() {}

  ngOnChanges() { this.stackStatus = '';
    if (this.licenseData) {
      if (this.licenseData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.licenseData.f8a_stack_licenses[0];
        this.stackStatus = this.licenseData.status;
      } else if (this.licenseData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.licenseData.status;
      } else if (this.licenseData.status.toLowerCase() === 'conflict' || this.licenseData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.licenseData.status;
      }
    } else if (this.lisData) {
      if (this.lisData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.lisData.stack_license;
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'conflict' || this.lisData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.lisData.status;
      }
    } else {
      this.stackLicense = null;
      this.stackStatus = null;
    }
    this.licenseAll = [];
    if (this.stackStatus === 'Successful') {
      for (let x = 0 ; x < this.allLicenses.length ; x++) {
          this.allLicenses.forEach((i) => {
            this.licenseAll.push(i);
          });
        this.licenseChange();
      }
    }
  }

  ngOnInit() {}

  public getShow(event: any) {
    this.toHave = event.toShow;
  }

  public licenseChange() {
    if (this.stackStatus === 'Successful') {
      if (this.licenseAll) {
        this.licenseDt = [];
        this.licenseCount = {};
        this.licenseAll.forEach(d => {
          this.licenseDt = this.licenseDt.concat(
                d
              );
            });
          this.licenseDt.forEach((item: string) => {
            this.licenseCount[item] = (this.licenseCount[item] || 0) + 1;
          });
          this.liData = [];
          Object.keys(this.licenseCount).forEach((k: any) => {
            this.liData.push([
              k,
              Math.round(this.licenseCount[k] * 100 / this.licenseDt.length)
            ]);
          });
        }
    }
       this.displayLicenses(this.liData);
  }

  public displayLicenses(liData: any): void {
    if (this.stackStatus === 'Successful') {
      this.charts['data'] = {
      columns: liData,
      type: 'donut'
    };
    this.charts['options'] = {
      donut: {
        title:  liData.length + ' Licenses',
        width: 10,
        label: {
           show: false
           }
    },
    size: {
      height: 200,
      width: 230
    }
   };
    this.charts['configs'] = {
      legend: {
        show: true,
        position: 'right'
      }
    };
   }
  }
}
