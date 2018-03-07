import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
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
  EventDataModel,
  LicenseStackAnalysisModel,
  BoosterInfo
} from '../model/data.model';
import {
  DependencySnapshot
} from '../utils/dependency-snapshot';

@Component({
  selector: 'app-dependency-editor',
  styleUrls: ['./dependency-editor.component.less'],
  templateUrl: './dependency-editor.component.html'
})
export class DependencyEditorComponent implements OnInit, OnChanges {
  @Input() githubUrl = '';
  @Input() boosterInfo: BoosterInfo;
  @ViewChild('dependencyPreview') modalDependencyPreview: any;

  public dependencies: Array < DependencySnapshotItem > ;
  public companions: Array < ComponentInformationModel > ;
  public alternate: Array < ComponentInformationModel > ;
  public licenseData: StackLicenseAnalysisModel;
  public lisData: LicenseStackAnalysisModel;
  public allLicenses: Array<any> = [];
  public cveData: CveResponseModel;
  public dependenciesAdded: Array < ComponentInformationModel > = [];
  public packageLength = 0;
  public addPackageLength = 0;
  public listView = 'View Dependency List';

  private stackUrl: string;
  private stackUrlDev: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;
  private getLicenseUrl: string;
  private isDepSelectedFromSearch = false;
  private depToAdd: DependencySearchItem;
  private showList = false;

  constructor(
    private service: DependencyEditorService
  ) {}

  ngOnInit() {
    this.stackUrl = 'http://bayesian-api-rratnawa-fabric8-analytics.dev.rdu2c.fabric8.io/api/v1/stack-analyses/';
    this.getDepInsightsUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-analyses/';
    this.getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';
    this.getLicenseUrl = 'http://f8a-license-analysis-license-api.dev.rdu2c.fabric8.io/api/v1/license-recommender';

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
        this.callDepServices(data);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['githubUrl']['currentValue']) {
      this.postStackAnalyses(this.githubUrl);
    }
  }

  public callDepServices(eventData: EventDataModel) {
    this.reset();
    this.service.updateDependencyAddedSnapshot(eventData);
    this.dependenciesAdded = DependencySnapshot.DEP_FULL_ADDED;
    const payload = this.service.getPayload();
    this.getDependencyInsights(payload);
    this.getCveData(payload);
    this.getLicenseData(payload);
  }

  public checkIfAlternatePresent(alternates: ComponentInformationModel[]) {
    alternates.forEach((alternate: ComponentInformationModel) => {
      DependencySnapshot.DEP_FULL_ADDED.forEach((depAdded) => {
        if (alternate.name === depAdded.name) {
          depAdded.alternate = alternate.alternate;
        }
      });
    });
  }

  public checkIfSecurityPresent(analyzedDependencies: ComponentInformationModel[]) {
    DependencySnapshot.DEP_FULL_ADDED.forEach((depFullAdded: ComponentInformationModel) => {
      if (!depFullAdded.security) {
        const objWithSecurity = _.find(analyzedDependencies, (dep) => {
          return dep.name === depFullAdded.name;
        });
      }
    });
  }

  public viewList() {
    this.showList = !this.showList;
    if (this.showList === false) {
      this.listView = 'View Dependency List';
    }
    if (this.showList === true) {
      this.listView = 'Hide Dependency List';
    }
  }

  public showDependencyModal(event: Event) {
    this.modalDependencyPreview.open();
    this.packageLength = DependencySnapshot.DEP_SNAPSHOT.length;
    this.addPackageLength = DependencySnapshot.DEP_SNAPSHOT_ADDED.length;
  }

  public closemodal() {
    this.modalDependencyPreview.close();
  }

  private reset() {
    this.companions = null;
    this.alternate = null;
    this.dependenciesAdded = null;
    this.cveData = null;
    this.licenseData = null;
  }

  private setDependencies(result: ResultInformationModel) {
    if (result && result.user_stack_info && result.user_stack_info.dependencies) {
      this.dependencies = result.user_stack_info.dependencies;
    }
  }

  private setCompanions(result: ResultInformationModel) {
    if (result && result.recommendation && result.recommendation.companion) {
      this.companions = result.recommendation.companion;
    }
  }

  private setLicenseData(result: ResultInformationModel) {
    this.licenseData = result.user_stack_info.license_analysis;
    this.allLicenses = result.user_stack_info.distinct_licenses;
  }

  private setAlternate(result: ResultInformationModel) {
    if (result && result.recommendation && result.recommendation.alternate) {
      this.alternate  = result.recommendation.alternate;
    }
  }

  private postStackAnalyses(githubUrl: string) {
    this.service.postStackAnalyses(githubUrl)
    .subscribe((data: any) => {
      this.service.getStackAnalyses(this.stackUrl + data['id'])
      .subscribe((response) => {
        const result = response.result[0];
        DependencySnapshot.ECOSYSTEM = result.user_stack_info.ecosystem;
        DependencySnapshot.DEP_SNAPSHOT = result.user_stack_info.dependencies;
        DependencySnapshot.REQUEST_ID = response.request_id;
        this.setDependencies(result);
        this.setCompanions(result);
        this.setAlternate(result);
        this.setLicenseData(result);
        this.getCveData(this.service.getPayload());
      });
    });
  }

  private getLicenseData(payload: any) {
    this.service.getDependencyData1(this.getLicenseUrl, payload)
      .subscribe((response: LicenseStackAnalysisModel) => {
        this.lisData = response;
        this.allLicenses = response.packages;
      });
  }

  private getDependencyInsights(payload: any) {
    const persist = false;
    const urlToHit = this.getDepInsightsUrl + '?persist=' + persist;
    this.service.getDependencyData(urlToHit, payload)
      .subscribe((response: StackReportModel) => {
        this.setCompanions(response.result[0]);
        this.setAlternate(response.result[0]);
        if (this.isDepSelectedFromSearch) {
          DependencySnapshot.DEP_FULL_ADDED.push( < ComponentInformationModel > this.depToAdd);
          this.isDepSelectedFromSearch = false;
        }
        this.checkIfAlternatePresent(response.result[0].recommendation.alternate);
        this.checkIfSecurityPresent(response.result[0].user_stack_info.analyzed_dependencies);
      });
  }

  private getCveData(payload: any) {
    this.service.getDependencyData(this.getCveUrl, payload)
      .subscribe((response: CveResponseModel) => {
        this.cveData = response;
      });
  }
}
