import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
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
import { StackLicenseAnalysisModel } from '../model/data.model';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.less']
})

export class LicenseComponent implements OnInit, OnChanges {
  @Input() licenseData: StackLicenseAnalysisModel;

  public title = 'License';
  public icon = 'fa fa-file-text-o';
  public stackLicense: string;
  public hasIssue: boolean | string = false;
  public responseReady = false;
  public toHave : boolean = false;

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
    }
  }

  ngOnInit() {}

  public getShow(event) {
    this.toHave = event.toShow;
    console.log("show toHave variable ",this.toHave);
  }
}
