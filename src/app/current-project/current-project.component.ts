import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';
import { DependencySnapshotItem, CveResponseModel, StackLicenseAnalysisModel, LicenseStackAnalysisModel } from '../model/data.model';

@Component({
  selector: 'app-current-project',
  templateUrl: './current-project.component.html',
  styleUrls: ['./current-project.component.less']
})

export class CurrentprojectComponent implements OnInit, OnChanges {
  @Input() dependencies: Array<DependencySnapshotItem>;
  @Input() metadata: any;
  @Input() licenseData: StackLicenseAnalysisModel;
  @Input() lisData: LicenseStackAnalysisModel;
  @Input() cveData: CveResponseModel;
  @Input() allLicenses: Array<any> = [];  
  
  public projectDependencies: string[]  ;
  public isOpen : boolean = false; 
  public upDown: string = "fa fa-angle-up";

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    debugger;
    console.log(this.dependencies);
  }
}
