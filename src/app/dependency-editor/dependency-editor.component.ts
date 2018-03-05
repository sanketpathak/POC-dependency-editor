import {
  Component,
  OnInit,
  OnChanges,
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
  LicenseStackAnalysisModel
} from '../model/data.model';
import {
  DependencySnapshot
} from '../utils/dependency-snapshot';

@Component({
  selector: 'app-dependency-editor',
  styleUrls: ['./dependency-editor.component.less'],
  templateUrl: './dependency-editor.component.html'
})
export class DependencyEditorComponent implements OnInit {
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

  private stackUrl: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;
  private getLicenseUrl: string;
  private isDepSelectedFromSearch = false;
  private depToAdd: DependencySearchItem;
  public listView = 'View Dependency List';
  private showList = false;

  constructor(private service: DependencyEditorService) {}

  ngOnInit() {
    // this.stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/d211493b7c6944e6a14ba8b18a42fb06';
    this.stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/61da63a454714f7f888f697141f15f3f';
    this.stackUrl = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/stack-analyses/9c0a853530de498492aa8bac461c9a91';
    // this.stackUrl = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/stack-analyses/ae7e3dab645a48fa9e186e7d30521917';
    // 718c0b279b474efe85d7e8af3cf9c521
    // d78398d31eab456d85bc1801aeee0aef
    // 097d603a811a4609b177383f5170856d
    // d211493b7c6944e6a14ba8b18a42fb06 - vertx http - prod
    // 9c0a853530de498492aa8bac461c9a91 - vertx http - stage
    this.getDepInsightsUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-analyses/';
    this.getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';
    this.getLicenseUrl = 'http://f8a-license-analysis-license-api.dev.rdu2c.fabric8.io/api/v1/license-recommender';
    this.service.getStackAnalyses(this.stackUrl)
      .subscribe((response: StackReportModel) => {
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

  public callDepServices(eventData: EventDataModel) {
    this.reset();
    this.service.updateDependencyAddedSnapshot(eventData);
    this.dependenciesAdded = DependencySnapshot.DEP_FULL_ADDED;
    const payload = this.service.getPayload();
    this.getDependencyInsights(payload);
    this.getCveData(payload);
    this.getLicenseData(payload);
  }

  private reset() {
    this.companions = null;
    this.alternate = null;
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
    this.allLicenses = result.user_stack_info.distinct_licenses;
  }

  private setAlternate(result: ResultInformationModel) {
    this.alternate  = result.recommendation.alternate;
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

  checkIfAlternatePresent(alternates: ComponentInformationModel[]) {
    alternates.forEach((alternate: ComponentInformationModel) => {
      DependencySnapshot.DEP_FULL_ADDED.forEach((depAdded) => {
        if (alternate.name === depAdded.name) {
          depAdded.alternate = alternate.alternate;
        }
      });
    });
  }

  checkIfSecurityPresent(analyzedDependencies: ComponentInformationModel[]) {
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
}
