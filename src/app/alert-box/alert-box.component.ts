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
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import * as c3 from 'c3';
import {
  StackLicenseAnalysisModel
} from '../model/data.model';

@Component({
  selector: 'app-alert-box',
  styleUrls: ['./alert-box.component.less'],
  templateUrl: './alert-box.component.html'
})

export class AlertBoxComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() colored: string;
  @Input() issueStatus: string;
  @Input() issueSymbol: string;
  @Input() issueType: string;
  @Input() licolor: string;
  @Input() secureIssue: boolean = false;
  @Input() licenseIssue: boolean;
  @Input() itSecurity: boolean;
  @Input() licenseAll: Array < string > = [];
  @Input() hasIssue: boolean;
  @Input() cveName: Array<any> = [];
  @Input() liData: Array<any> = [];
  @Input() charts: any = {};
  public isLoading = true;
  public cveId: Array<any> = [];
  public cvePackage: Array<any> = [];

  constructor() {}

  ngOnInit() {
  }

  ngOnChanges() {
    this.isLoading = true;
    if (this.issueStatus === null) {
      this.isLoading = true;
    } else if (typeof this.issueStatus === 'string' && this.issueStatus) {
      this.isLoading = false;
    } else if (typeof this.issueStatus === 'number') {
      this.isLoading = false;
    }
    this.getCves();
  }

  public get_secure() {
    this.secureIssue = true;
  }

  public getCves() {
    this.cveId = [];
    for (let i = 0; i < this.cveName.length; i++) {
      this.cveName[i][0].forEach((e: any) => {
        this.cveId.push({
          'id': e.cve_id,
          'package': this.cveName[i][1]
        });
      });
    }
  }
}
