import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AccordionModule } from 'ngx-bootstrap';
import { DependencySnapshotItem, CveResponseModel, StackLicenseAnalysisModel, LicenseStackAnalysisModel, BoosterInfo } from '../model/data.model';

@Component({
  selector: 'app-current-project',
  styleUrls: ['./current-project.component.less'],
  templateUrl: './current-project.component.html'
})

export class CurrentprojectComponent implements OnInit, OnChanges {
  @Input() dependencies: Array<DependencySnapshotItem>;
  @Input() boosterInfo: BoosterInfo;
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() lisData: LicenseStackAnalysisModel;
  @Input() cveData: CveResponseModel;
  @Input() allLicenses: Array<any> = [];

  public projectDependencies: string[];
  public isOpen = false;
  public upDown = 'fa fa-angle-up';

  constructor(
    public dom: DomSanitizer
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {

  }
}
