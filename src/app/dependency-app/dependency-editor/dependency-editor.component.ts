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
import * as _ from 'lodash';

import {
  DependencyEditorService
} from '../shared/dependency-editor.service';
import {
  StackReportModel,
  DependencySnapshotItem,
  ComponentInformationModel,
  ResultInformationModel,
  StackLicenseAnalysisModel,
  CveResponseModel,
  DependencySearchItem,
  EventDataModel
} from '../model/data.model';
import {
  DependencySnapshot
} from '../utils/dependency-snapshot';

@Component({
  selector: 'app-dependency-editor',
  templateUrl: './dependency-editor.component.html',
  styleUrls: ['./dependency-editor.component.less']
})
export class DependencyEditorComponent implements OnInit {
  public dependencies: Array < DependencySnapshotItem > ;
  public companions: Array < ComponentInformationModel > ;
  public licenseData: StackLicenseAnalysisModel;
  public cveData: CveResponseModel;
  public dependenciesAdded: Array < ComponentInformationModel > = [];

  private stackUrl: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;
  private isDepSelectedFromSearch = false;
  private depToAdd: DependencySearchItem;

  constructor(private service: DependencyEditorService) {}

  ngOnInit() {
    this.stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/d78398d31eab456d85bc1801aeee0aef';
    // 718c0b279b474efe85d7e8af3cf9c521
    // d78398d31eab456d85bc1801aeee0aef
    this.getDepInsightsUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-analyses/';
    this.getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';
    this.service.getStackAnalyses(this.stackUrl)
      .subscribe((response: StackReportModel) => {
        const result = response.result[0];
        DependencySnapshot.ECOSYSTEM = result.user_stack_info.ecosystem;
        DependencySnapshot.DEP_SNAPSHOT = result.user_stack_info.dependencies;
        DependencySnapshot.REQUEST_ID = response.request_id;
        this.setDependencies(result);
        this.setCompanions(result);
        this.setLicenseData(result);
        this.getCveData(this.service.getPayload());
      });
    this.service.dependencySelected
      .subscribe((depSelected: DependencySearchItem) => {
        this.isDepSelectedFromSearch = true;
        this.depToAdd = depSelected;
        const obj = {
          depFull: null,
          depSnapshot: {
            package: depSelected.name,
            version: depSelected.version
          },
          action: 'add'
        };
        this.callDepServices(obj);
      });
    this.service.dependencyRemoved
      .subscribe((data: EventDataModel) => {
        console.log(data);
        this.callDepServices(data);
      });
  }

  public callDepServices(eventData: EventDataModel) {
    this.reset();
    this.service.updateDependencyAddedSnapshot(eventData);
    this.dependenciesAdded = DependencySnapshot.DEP_FULL_ADDED;
    const payload = this.service.getPayload();
    this.getDependencyInsights(payload);
    this.getCveData(payload);
  }

  private reset() {
    this.companions = null;
    this.dependenciesAdded = null;
    this.cveData = null;
    this.licenseData = null;
  }

  private setDependencies(result: ResultInformationModel) {
    this.dependencies = result.user_stack_info.dependencies;
  }

  private setCompanions(result: ResultInformationModel) {
    this.companions = result.recommendation.companion;
  }

  private setLicenseData(result: ResultInformationModel) {
    this.licenseData = result.user_stack_info.license_analysis;
  }

  private getDependencyInsights(payload: any) {
    const persist = false;
    const urlToHit = this.getDepInsightsUrl + '?persist=' + persist;
    this.service.getDependencyData(urlToHit, payload)
      .subscribe((response: StackReportModel) => {
        console.log('response after get dependency insights', response);
        this.setCompanions(response.result[0]);
        this.setLicenseData(response.result[0]);
        if (this.isDepSelectedFromSearch) {
          DependencySnapshot.DEP_FULL_ADDED.push( < ComponentInformationModel > this.depToAdd);
          this.isDepSelectedFromSearch = false;
        }
        this.checkIfAlternatePresent(response.result[0].recommendation.alternate);
        console.log(DependencySnapshot.DEP_FULL_ADDED);
        console.log(DependencySnapshot.DEP_SNAPSHOT_ADDED);
        console.log(DependencySnapshot.DEP_SNAPSHOT);
        console.log(DependencySnapshot.ECOSYSTEM);
      });
  }

  private getCveData(payload: any) {
    this.service.getDependencyData(this.getCveUrl, payload)
      .subscribe((response: CveResponseModel) => {
        this.cveData = response;
      });
  }

  checkIfAlternatePresent(alternates: ComponentInformationModel[]) {
    alternates.forEach((alternate: ComponentInformationModel) => {
      DependencySnapshot.DEP_FULL_ADDED.forEach((depAdded) => {
        if (alternate.name === depAdded.name) {
          depAdded.alternate = alternate.alternate;
        }
      });
    });
  }
}
