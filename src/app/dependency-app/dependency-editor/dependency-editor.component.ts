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

import {
  DependencyEditorService
} from '../shared/dependency-editor.service';
import {
  StackReportModel,
  DependencySnapshotItem,
  ComponentInformationModel,
  ResultInformationModel,
  StackLicenseAnalysisModel,
  CveResponseModel
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

  private stackUrl: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;

  constructor(private service: DependencyEditorService) {
  }

  ngOnInit() {
    this.stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/66ecaa97429a48fd90663d1c9bfe05b0';
    this.getDepInsightsUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-analyses/';
    this.getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';
    this.service.getStackAnalyses(this.stackUrl)
      .subscribe((response: StackReportModel) => {
        console.log('stack response', response);
        const result = response.result[0];
        DependencySnapshot.ECOSYSTEM = result.user_stack_info.ecosystem;
        DependencySnapshot.DEP_SNAPSHOT = result.user_stack_info.dependencies;
        DependencySnapshot.REQUEST_ID = response.request_id;
        this.setDependencies(result);
        this.setCompanions(result);
        this.setLicenseData(result);
        this.getCveData(this.getPayload());
      });
  }

  public callDepServices(dependency: ComponentInformationModel) {
    const payload = this.getPayload(dependency);
    this.getDependencyInsights(payload);
    this.getCveData(payload);
  }

  private getPayload(dependency?: ComponentInformationModel) {
    const payload = {};
    let deps: Array<DependencySnapshotItem>;
    if (dependency) {
      const selectedDependency = [{
        'package': dependency.name,
        'version': dependency.version
      }];
      deps = DependencySnapshot.DEP_SNAPSHOT.concat(selectedDependency);
    } else {
      deps = DependencySnapshot.DEP_SNAPSHOT;
    }
    payload['_resolved'] = deps;
    payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
    payload['request_id'] = DependencySnapshot.REQUEST_ID;
    return payload;
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
    this.service.getDepData(urlToHit, payload)
    .subscribe((response: StackReportModel) => {
      console.log('response after get dependency insights', response);
    });
  }

  private getCveData(payload: any) {
    this.service.getDepData(this.getCveUrl, payload)
    .subscribe((response: CveResponseModel) => {
      console.log('response after get cve call', response);
      this.cveData = response;
    });
  }
}
