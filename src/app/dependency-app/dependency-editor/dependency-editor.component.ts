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
  // @ViewChild('previewModal') previewModal: any;
  @ViewChild('dependencyPreview') modalDependencyPreview : any;
  
  public dependencies: Array < DependencySnapshotItem > ;
  public companions: Array < ComponentInformationModel > ;
  public licenseData: StackLicenseAnalysisModel;
  public allLicenses: Array<any> = [];  
  public cveData: CveResponseModel;
  public dependenciesAdded: Array < ComponentInformationModel > = [];
  public packageLength: number = 0;
  public addPackageLength: number = 0;
  
  private stackUrl: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;
  private isDepSelectedFromSearch = false;
  private depToAdd: DependencySearchItem;
  public listView: string = "View Dependency List";
  private showList: boolean = false;
  


  constructor(private service: DependencyEditorService) {}

  ngOnInit() {
    this.stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/d211493b7c6944e6a14ba8b18a42fb06';
    this.stackUrl = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/stack-analyses/9c0a853530de498492aa8bac461c9a91';
    // 718c0b279b474efe85d7e8af3cf9c521
    // d78398d31eab456d85bc1801aeee0aef
    // 097d603a811a4609b177383f5170856d
    // d211493b7c6944e6a14ba8b18a42fb06 - vertx http - prod
    // 9c0a853530de498492aa8bac461c9a91 - vertx http - stage
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
        console.log("dependency-editor stack anlyses result",result);
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
    this.allLicenses = result.user_stack_info.distinct_licenses;
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
        this.checkIfSecurityPresent(response.result[0].user_stack_info.analyzed_dependencies);
        console.log(DependencySnapshot.DEP_FULL_ADDED);
        console.log(DependencySnapshot.DEP_SNAPSHOT_ADDED);
        console.log(DependencySnapshot.DEP_SNAPSHOT);
        console.log(DependencySnapshot.ECOSYSTEM);
      });
  }

  private getCveData(payload: any) {
    this.service.getDependencyData(this.getCveUrl, payload)
      .subscribe((response: CveResponseModel) => {
        console.log('cve data', response);
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
        depFullAdded.security = objWithSecurity.security;
      }
    });
  }

  // showPreviewModal() {
  //   this.previewModal.open();
  // }
  public viewList() {
    this.showList = !this.showList;
    console.log("show list variable",this.showList);
    if(this.showList === false) {
      this.listView = "View Dependency List";
    }
    if(this.showList === true) {
      this.listView = "Hide Dependency List";
    }
  }

  public showDependencyModal(event: Event) {
    this.modalDependencyPreview.open();
    this.packageLength = DependencySnapshot.DEP_SNAPSHOT.length;
    this.addPackageLength = DependencySnapshot.DEP_SNAPSHOT_ADDED.length;
    console.log(this.packageLength,this.addPackageLength);
  }
  public closemodal(){
    this.modalDependencyPreview.close();
  }
}
