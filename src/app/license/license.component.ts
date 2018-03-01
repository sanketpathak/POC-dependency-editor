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
  TagInputModule
} from 'ngx-chips';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import { StackLicenseAnalysisModel, LicenseStackAnalysisModel } from '../model/data.model';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.less']
})

export class LicenseComponent implements OnInit, OnChanges {
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() lisData: LicenseStackAnalysisModel;
  @Input() allLicenses: Array<any> = [];

  @ViewChild(AlertBoxComponent) private alertBoxComponent: AlertBoxComponent;

  public title = 'License';
  public icon = 'pficon pficon-on-running'; // fa-file-text-o
  public stackLicense: string;
  public stackStatus: string;
  public hasIssue: boolean | string = false;
  public responseReady = false;
  public toHave = false;
  public licenseAll: Array<string> = [];
  public licenseIssue = true;
  public licenseDt: Array<any> = [];
  // public allLicenses: Array<any> = [];
  public licenseCount = {};
  public liData = [];
  public charts: any = {};

  constructor() {}

  ngOnChanges() {console.log('lis data in license module = ',this.lisData);
  if (this.licenseData) {console.log('hola'); // || this.lisData
    if (this.licenseData.status.toLowerCase() === 'successful' ) { // || this.lisData.status.toLowerCase() === 'successful'
      this.hasIssue = false;
      this.stackLicense = this.licenseData.f8a_stack_licenses[0]; // || this.lisData.stack_license;
      this.stackStatus = this.licenseData.status;
    } else if (this.licenseData.status.toLowerCase() === 'failure') { // this.lisData.status.toLowerCase() === 'failure' || 
      this.hasIssue = 'na';
      this.stackLicense = 'Unknown';
      this.stackStatus = this.licenseData.status;
    } else if (this.licenseData.status.toLowerCase() === 'conflict' || this.licenseData.status.toLowerCase() === 'unknown') {
      this.hasIssue = true;
      this.stackLicense = 'None';
      this.stackStatus = this.licenseData.status;
    }
 }// else {
//   this.stackLicense = null;
// }
  // tslint:disable-next-line:one-line
  else if (this.lisData) {console.log('hello'); // this.licenseData ||
      if (this.lisData.status.toLowerCase() === 'successful') { // this.licenseData.status.toLowerCase() === 'successful' ||  
        this.hasIssue = false;
        this.stackLicense = this.lisData.stack_license;
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'failure') { // || this.licenseData.status.toLowerCase() === 'failure'
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
        this.stackStatus = this.lisData.status;
      } else if (this.lisData.status.toLowerCase() === 'conflict' || this.lisData.status.toLowerCase() === 'unknown' ) {
        this.hasIssue = true;
        this.stackLicense = 'None';
        this.stackStatus = this.lisData.status;
      }
    } else {
      this.stackLicense = null;
    }
    for (let x = 0 ; x < this.allLicenses.length ; x++) {console.log('license All', this.licenseAll);
      if (typeof(this.allLicenses[0]) !== 'string') {
        this.allLicenses.forEach( (i) => {
                          i.licenses.forEach( (j) => {
                            this.licenseAll.push(j);
                            console.log('license All', this.licenseAll);
                          });
        });
      }
      // tslint:disable-next-line:one-line
      else {
        this.allLicenses.forEach( (i) => {
          this.licenseAll.push(i);
          console.log('license All', this.licenseAll, i);
        });
      }
      console.log('ssssssstack License', this.stackLicense);
      this.licenseChange();
      console.log('initial licenseData : ' + this.licenseDt);
      this.displayLicenses();
    }
  }

  ngOnInit() {
  }

  public getShow(event) {
    this.toHave = event.toShow;
    console.log('show toHave variable ', this.toHave);
  }

  public licenseChange() {
    console.log('license All in change function', this.licenseAll, this.licenseDt);
    if (this.licenseAll) {
      // this.licenseData = [];
      this.licenseCount = {};
       this.licenseAll.forEach(d => {
       this.licenseDt = this.licenseDt.concat(
            d
          );
        console.log('license data from all license data', this.licenseDt);
        });
      this.licenseDt.forEach(item => {
        this.licenseCount[item] = (this.licenseCount[item] || 0) + 1;
      });
      this.liData = [];
      Object.keys(this.licenseCount).forEach(k => {
        this.liData.push([
          k,
          Math.round(this.licenseCount[k] * 100 / this.licenseDt.length)
        ]);
      });
      console.log('license data for chart is :', this.liData);
    }   this.displayLicenses();
  }

  public displayLicenses(): void {
    if (this.stackStatus === 'Successful') {
      this.charts['data'] = {
      columns: this.liData,
    //   columns: [
    //     // ['data1', 30],
    //     // ['data2', 70],
    //     this.liData,
    // ],
      type: 'donut'
    };
    this.charts['options'] = {
      donut: {
        title: ' Licenses', // + this.licenseData.length
        width: 10,
    },
    size: {
      height: 200,
      width: 230
    }
   };
    this.charts['configs'] = {
      legend: {
        show: true,
      }
    };
   } console.log('display of license data', this.charts['data']);
  }

}
