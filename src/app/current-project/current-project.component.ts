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

  @Output() getMetadata: EventEmitter<any> = new EventEmitter<any>();

  public projectDependencies: string[];
  public isOpen = false;
  public upDown = 'fa fa-angle-up';
  public metadata: any = {};
  public start: number = 1;

  constructor(
    public dom: DomSanitizer
  ) { }

  ngOnInit() {
}

  ngOnChanges() {
    if (this.boosterInfo && this.boosterInfo.mission && this.start > 0) {
      this.start = 0;
      this.metadata['groupId'] = 'io.openshift.booster';
      this.metadata['artifactId'] = this.boosterInfo.runtime.id + '.' + this.boosterInfo.mission.id;
      this.metadata['version'] = '1.0.0.SNAPSHOT';
      this.getMetadata.emit(this.metadata);
    }
    // this.getMetadata.emit(this.metadata);
  }

  public getGroupId(event: any) {
    this.metadata['groupId'] = event.target.value ;
    this.getMetadata.emit(this.metadata);
  }

  public getArtifactId(event: any) {
    this.metadata['artifactId'] = event.target.value ;
    this.getMetadata.emit(this.metadata);
  }

  public getVersion(event: any) {
    this.metadata['version'] = event.target.value ;
    this.getMetadata.emit(this.metadata);
  }
}
