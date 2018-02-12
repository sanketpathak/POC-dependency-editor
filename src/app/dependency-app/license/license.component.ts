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
  public hasIssue = false;
  public responseReady = false;

  constructor() {}

  ngOnChanges() {
    if (this.licenseData) {
      this.stackLicense = this.licenseData.f8a_stack_licenses[0];
      if (this.licenseData.status.toLowerCase() !== 'successful') {
        this.hasIssue = true;
      }
      this.responseReady = true;
    }
  }

  ngOnInit() {}

}
