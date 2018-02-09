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
import { StackLicenseAnalysisModel } from '../model/stack-response.model';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.less']
})

export class LicenseComponent implements OnInit, OnChanges {
  @Input() licenseData: StackLicenseAnalysisModel;

  public issue_name: string;
  public issue_symbol: string;
  public issue_status: string;
  public alert_title: string;
  public colored: string;
  public secureIssue = false;

  constructor() {}

  ngOnChanges() {
    console.log(this.licenseData);
  }

  ngOnInit() {}

}
