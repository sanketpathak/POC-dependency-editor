import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import {
  ComponentInformationModel,
  DependencySearchItem,
  DependencySnapshotItem,
  CategorySearchItem,
  CveResponseModel,
  BoosterInfo
} from '../model/data.model';
import {
  DependencyEditorService
} from '../shared/dependency-editor.service';
import {
  DependencySnapshot
} from '../utils/dependency-snapshot';
import { FilterPipe } from './add-dependency.pipe';

@Component({
  selector: 'app-add-dependency',
  styleUrls: ['./add-dependency.component.less'],
  templateUrl: './add-dependency.component.html'
})

export class AddDependencyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() boosterInfo: BoosterInfo;
  @Input() dependencies: Array < ComponentInformationModel > ;
  @Input() dependencyAdded: Array < DependencySnapshotItem > ;
  @Input() existDependencies: Array < DependencySnapshotItem > ;
  @ViewChild('PackagePreview') modalPackagePreview: any;

  public queryString: any;
  public dependencySearchString: string;
  public dependencySearchResult: Array < DependencySearchItem > = [];
  public isLoading = false;
  public categorySearchResult: Array < CategorySearchItem > = [];
  public categoryResult: Array<any> = [];
  public tagZero = 0;

  public searchKey = '';
  public selected: string;
  public suggestions: Array < any > = [];
  public dependenciesData: Array < any > = [];
  public masterTags: Array < any > = [];
  public selectedTags = new Set();
  public categories: Array<any> = [];
  public cveTemporaryData: CveResponseModel;
  public cveName: any = [];
  public noOfTags = 0;
  public saveTagname: Array<any> = [];
  public type = false;
  public tags: Array < DependencySearchItem > = [];
  public toast: boolean = false;


  // private searchDepsUrl = 'https://recommender.api.openshift.io/api/v1/component-search/';
  private searchDepsUrl = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/component-search/';
  private categoryUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/categories/';
  // private categoryUrl = 'https://gist.githubusercontent.com/sanketpathak/9c431733f0b75623e6c88ae239e9813b/raw/494965a93039376f40116378c23404c1a5aeb5dd/vertx_package.json';
  private getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';

  constructor(private service: DependencyEditorService) {}

  ngOnInit() {
  }

  ngOnChanges() {
  }

  getDependencies() {
    this.isLoading = true;
    this.service.getDependencies(this.dependencySearchString)
      .subscribe((response: any) => {
        this.dependencySearchResult = response['result'];
        this.isLoading = false;
      });
  }

  getCategories() {
    this.isLoading = true;
    let runtime = '';
    if (this.boosterInfo.runtime.id === 'vert.x') {
      runtime = 'vertx';
    } else if (this.boosterInfo.runtime.id === 'spring-boot') {
      runtime = 'springboot';
    } else if (this.boosterInfo.runtime.id === 'wildfly-swarm') {
      runtime = 'wildflyswarm';
    }
    this.service.getCategories(runtime)
      .subscribe((response: any) => {
        this.categorySearchResult = response['categories'];
        this.isLoading = false;
        this.categoryResult = [];
        for (const key in this.categorySearchResult) {
          if (this.categorySearchResult.hasOwnProperty(key)) {
            this.categoryResult.push(this.categorySearchResult[key]);
          }
        }
        const p = this.getCategoryPayload();
        this.getCategoriesSecurity(p);
        this.addedTags();
      });
  }

  getCategoryPayload() {
    const payload: any = {};
    let j = 0;
    let category: any = [];
    this.categoryResult.forEach(i => {
      i.package.map((k: any) => {
        category.push({
          'package' : k.name,
          'version' : k.version
        });
      });
    });
    payload['_resolved'] = category;
    payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
    payload['request_id'] = DependencySnapshot.REQUEST_ID;
    return payload;
  }

  getCategoriesSecurity(payload: any) {
    this.service.getDependencyData('CVE', payload)
      .subscribe((response: CveResponseModel) => {
        this.cveTemporaryData = response;
        if (this.cveTemporaryData) {
          let count = -1;
          this.cveTemporaryData.result.forEach((item: any) => {
            count++;
            if (item.cve) {
              if (item.cve !== null) {
                this.cveName.push({
                  'detail' : item.cve.details, // cve:
                  'package': item.package
                });
              }
            }
          });
        }
      });
      this.masterTags.forEach( (i: any) => {
        for (let j = 0; j < this.cveName.length; j++)
        if (i.name === this.cveName['j'].package) {
          i.security = this.cveName['j'].detail;
        }
      });
  }

  changeTagname(master: any, t: boolean) {
    this.type = !t;
    for (let i = 0; i < this.masterTags.length; i++) {
      if (this.masterTags[i].name === master.name && this.masterTags[i].version === master.version && this.masterTags[i].category === master.category) {
        this.type = !t;
       if (this.masterTags[i].type === true && this.type === true) {
         continue;
       } else if (this.masterTags[i].type === true && this.type === false) {
         this.masterTags[i].type = false;
           this.noOfTags--;
           i++;
           break;
         } else if (this.masterTags[i].type === false) {
         if (this.type === true) {
           this.masterTags[i].type = true;
           this.noOfTags++;
           break;
         } else if (this.type === false) {
           this.masterTags[i].type = false;
           this.noOfTags--;
           break;
         }
       }
     }
    }
  }

  listenInputSearch() {
    if (this.dependencySearchString === '') {
      this.dependencySearchResult = [];
    }
  }

  addDependency() {
    this.dependencySearchResult = [];
    this.dependencySearchString = '';
    this.noOfTags = 0;
    this.saveTagname = [];
    for (let i = 0; i < this.masterTags.length; i++) {
      if (this.masterTags[i].type === true) {
        this.tags = [];
        this.tags.push({
          'ecosystem' : DependencySnapshot.ECOSYSTEM,
          'version' : this.masterTags[i].version,
          'name' : this.masterTags[i].name
        });
        this.saveTagname.push({
          'name': this.masterTags[i].name
        });
        this.toast = true;
        this.masterTags[i].grouped = true;
        this.masterTags[i].type = false;
        this.service.dependencySelected.emit(this.tags[0]);
      }
    }
  }

  addSearchDependency(depItem: DependencySearchItem) {
    this.dependencySearchResult = [];
    this.dependencySearchString = '';
    this.service.dependencySelected.emit(depItem);
  }

  ngOnDestroy() {
    this.dependencies = [];
    this.dependencySearchResult = [];
    this.categorySearchResult = [];
    this.categoryResult = [];
    this.dependencySearchString = '';
    this.isLoading = false;
  }

  removeDependency(dependency: any) {
    this.service.removeDependency(dependency);
  }

  public showPackageModal(event: Event) {
    this.modalPackagePreview.open();
    this.getCategories();
  }

  public closemodal() {
    this.modalPackagePreview.close();
  }

  public showDependency() {
  }

  handleUserInputKeyPress(event: KeyboardEvent): void {
  }

  public addedTags() {
    let count = 0;
    this.tagZero = 0;
    this.categoryResult.forEach((i: any) => {
      count++;
      this.tagZero = count;
      i.package.forEach((x: any) => {
        this.masterTags.push({
          'ecosystem' : DependencySnapshot.ECOSYSTEM,
          'version' : x.version,
          'name' : x.name,
          'category' : x.category,
          'type' : false,
          'grouped' : false,
          'security' : null,
          'present' : false
        });
      });
    });
    this.categoryResult.forEach((i: any) => {
      i.package.forEach((x: any) => {
          this.saveTagname.push({'name' : x, 'type' : false});
      });
  });
  for (let i = 0; i < this.masterTags.length; i++) {
    this.masterTags[i].present = false;
  }
  if (DependencySnapshot.DEP_FULL_ADDED.length === 0) {
    for (let i = 0; i < this.masterTags.length; i++) {
      this.masterTags[i].grouped = false;
    }
  } else {
    DependencySnapshot.DEP_FULL_ADDED.forEach((depAdded) => {
      for (let i = 0; i < this.masterTags.length; i++) {
        if (this.masterTags[i].name === depAdded.name && this.masterTags[i].version === depAdded.version) {
          this.masterTags[i].grouped = true;
          this.masterTags[i].present = true;
        } else {
          if (this.masterTags[i].present === true) {
            continue;
          } else {
            this.masterTags[i].grouped = false;
          }
        }
      }
    });
  }
  }
}
