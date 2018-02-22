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
import { StackLicenseAnalysisModel } from '../../model/data.model';
import { AlertBoxComponent } from '../alert-box/alert-box.component';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.less']
})

export class LicenseComponent implements OnInit, OnChanges {
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() allLicenses: Array<any> = [];

  @ViewChild(AlertBoxComponent) private alertBoxComponent:AlertBoxComponent;

  public title = 'License';
  public icon = 'pficon pficon-on-running'; // fa-file-text-o
  public stackLicense: string;
  public hasIssue: boolean | string = false;
  public responseReady = false;
  public toHave : boolean = false;
  public licenseIssue :  boolean = true;
  public licenseDt: Array<any> = [];
  // public allLicenses: Array<any> = [];
  public licenseCount = {};
  public liData = [];
  public charts: any = {};

  constructor() {}

  ngOnChanges() {
    if (this.licenseData) {
      if (this.licenseData.status.toLowerCase() === 'successful') {
        this.hasIssue = false;
        this.stackLicense = this.licenseData.f8a_stack_licenses[0];
      } else if (this.licenseData.status.toLowerCase() === 'failure') {
        this.hasIssue = 'na';
        this.stackLicense = 'Unknown';
      } else if (this.licenseData.status.toLowerCase() === 'conflict' || this.licenseData.status.toLowerCase() === 'unknown') {
        this.hasIssue = true;
        this.stackLicense = 'None';
      }
    } else {
      this.stackLicense = null;
    }console.log("ssssssstack License",this.stackLicense);
    this.licenseChange();
    console.log('initial licenseData : ' + this.licenseDt);
    this.displayLicenses();
  }

  ngOnInit() {}

  public getShow(event) {
    this.toHave = event.toShow;
  }

  public licenseChange() {debugger;
    if (this.allLicenses) {
      // this.licenseData = []; 
      this.licenseCount = {};
      debugger;
       this.allLicenses.forEach(d => {
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
    }    this.displayLicenses();
  }

  public displayLicenses(): void {debugger;
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
        title: ' Licenses',// + this.licenseData.length
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
  }

}
