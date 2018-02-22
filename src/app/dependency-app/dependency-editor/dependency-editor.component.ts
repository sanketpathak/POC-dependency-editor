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
  CveResponseModel,
  DependencySearchItem,
  EventDataModel
} from '../../model/data.model';
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
  public allLicenses: Array<any> = [];  
  public cveData: CveResponseModel;
  public dependenciesAdded: Array< ComponentInformationModel> = [];
  public listView: string = 'View Dependency List';

  private stackUrl: string;
  private getDepInsightsUrl: string;
  private getCveUrl: string;
  private isDepSelectedFromSearch = false;
  private depToAdd: DependencySearchItem;
  private showList: boolean = false;



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
        this.getCveData(this.service.getPayload());
        console.log("dependency-editor stack anlyses result",result);
      });
    this.service.dependencySelected
      .subscribe((depSelected: DependencySearchItem) => {
        console.log(depSelected);
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
        console.log('dep selected', this.isDepSelectedFromSearch);
        DependencySnapshot.DEP_FULL_ADDED.push(<ComponentInformationModel>this.depToAdd);
        this.isDepSelectedFromSearch = false;
      }
    });
  }

  private getCveData(payload: any) {
    this.service.getDependencyData(this.getCveUrl, payload)
    .subscribe((response: CveResponseModel) => {
      this.cveData = response;
    });
  }

  // showPreviewModal() {
  //   this.previewModal.open();
  // }
  // tslint:disable-next-line:member-ordering
  public viewList() {
    this.showList = !this.showList;
    console.log('show list variable', this.showList);
    if (this.showList === false) {
      this.listView = 'View Dependency List';
    }
    if (this.showList === true) {
      this.listView = 'Hide Dependency List';
    }
  }

  // public showDependencyModal(event: Event) {
  //   this.modalDependencyPreview.open();
  // }
  // public closemodal(){
  //   this.modalDependencyPreview.close();
  // }
}
