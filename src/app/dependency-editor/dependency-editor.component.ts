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
import { TimerObservable } from 'rxjs/observable/TimerObservable';

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
  public dependencyAdded: Array < DependencySnapshotItem > = [];
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

  constructor(
    private service: DependencyEditorService
  ) {
    this.stackUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/stack-analyses/';
    // this.stackUrl = 'http://bayesian-api-rratnawa-fabric8-analytics.dev.rdu2c.fabric8.io/api/v1/stack-analyses/';
    this.getDepInsightsUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-analyses/';
    // this.getDepInsightsUrl = 'http://bayesian-api-rratnawa-fabric8-analytics.dev.rdu2c.fabric8.io/api/v1/depeditor-analyses';
    // this.getDepInsightsUrl = 'https://gist.githubusercontent.com/sanketpathak/94bac9aa6997eac5f32016e74cd8dc6c/raw/ddf40dbc0bb12a1a9338c008b8d980047546af5b/stack_analyses';
    this.getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';
    // this.getCveUrl = 'http://bayesian-api-rratnawa-fabric8-analytics.dev.rdu2c.fabric8.io/api/v1/depeditor-cve-analyses/';
    // this.getCveUrl = 'https://gist.githubusercontent.com/sanketpathak/c0a7ccb4f6420fb783754f9454c347a0/raw/3d661bf010d6fe8b7adc23c305097334c10f510e/dependency%2520cve%2520analysis';
    // this.getLicenseUrl = 'http://f8a-license-analysis-license-api.dev.rdu2c.fabric8.io/api/v1/license-recommender';
    this.getLicenseUrl = 'https://license-analysis.api.prod-preview.openshift.io/api/v1/license-recommender';
  }

    ngOnInit() {
    this.service.dependencySelected
      .subscribe((depSelected: DependencySearchItem) => {
        this.isDepSelectedFromSearch = true;
        this.depToAdd = depSelected;
        const obj: any = {
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
    if (changes['githubUrl'] && changes['githubUrl']['currentValue']) {
      this.postStackAnalyses(this.githubUrl);
    }
  }

  public callDepServices(eventData: EventDataModel) {
    this.reset();
    this.service.updateDependencyAddedSnapshot(eventData);
    if (this.isDepSelectedFromSearch) {
      DependencySnapshot.DEP_FULL_ADDED.push( < ComponentInformationModel > this.depToAdd);
      this.isDepSelectedFromSearch = false;
    }
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
        // });
      let subs: any = null;
      let rec: any = null;
      const interval: number = 5000;
      let alive: boolean = true;
      let counter: number = 0;
      let observable: any = this.service
      .getStackAnalyses(data['id']);
      TimerObservable.create(0, interval)
      .takeWhile(() => alive)
      .subscribe(() => {
      if (rec) {
        subs.unsubscribe();
        alive = false;
      }
      subs = observable.subscribe((response: any) => {
        const result: any = response.result[0];
        rec = result.recommendation;
        DependencySnapshot.ECOSYSTEM = result.user_stack_info.ecosystem;
        DependencySnapshot.DEP_SNAPSHOT = result.user_stack_info.dependencies;
        DependencySnapshot.REQUEST_ID = response.request_id;
        this.setDependencies(result);
        this.setCompanions(result);
        this.setAlternate(result);
        this.setLicenseData(result);
        this.getCveData(this.service.getPayload());
      });
      if (counter ++ > 4) {
        alive = false;
    }
    });
    });
  }

  private getLicenseData(payload: any) {
    this.service.getDependencyData('LICENSE', payload)
      .subscribe((response: LicenseStackAnalysisModel) => {
        this.lisData = response;
        this.allLicenses = response.distinct_licenses;
      });
  }

  private getDependencyInsights(payload: any) {
    let subs: any = null;
    let rec: any = null;
    const interval: number = 5000;
    let alive: boolean = true;
    let counter: number = 0;
    // const persist = false;
    // const urlToHit = this.getDepInsightsUrl + '?persist=' + persist;
    let observable: any = this.service
    .getDependencyData('DEPEDITORANALYSIS', payload);
    TimerObservable.create(0, interval)
    .takeWhile(() => alive)
    .subscribe(() => {
    if (rec) {
      subs.unsubscribe();
      alive = false;
    }
    subs = observable.subscribe((response: StackReportModel) => {
        rec = response;
        this.setCompanions(response.result[0]);
        this.setAlternate(response.result[0]);
        this.checkIfAlternatePresent(response.result[0].recommendation.alternate);
        this.checkIfSecurityPresent(response.result[0].user_stack_info.analyzed_dependencies);
      });
      if (counter ++ > 4) {
        alive = false;
    }
    });
  }

  private getCveData(payload: any) {
    this.service.getDependencyData('CVE', payload)
      .subscribe((response: CveResponseModel) => {
        this.cveData = response;
      });
  }
}
