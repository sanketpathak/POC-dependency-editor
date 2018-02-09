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
  StackLicenseAnalysisModel
} from '../model/stack-response.model';
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

  constructor(private service: DependencyEditorService) {
  }

  ngOnInit() {
    const stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/66ecaa97429a48fd90663d1c9bfe05b0';
    this.service.getStackAnalyses(stackUrl)
      .subscribe((response: StackReportModel) => {
        console.log('stack response', response);
        const result = response.result[0];
        DependencySnapshot.ECOSYSTEM = result.user_stack_info.ecosystem;
        DependencySnapshot.DEP_SNAPSHOT = result.user_stack_info.dependencies;
        DependencySnapshot.REQUEST_ID = response.request_id;
        this.setDependencies(result);
        this.setCompanions(result);
        this.setLicenseData(result);
      });
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
}
