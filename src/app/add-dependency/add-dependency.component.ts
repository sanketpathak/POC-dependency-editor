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
  CveResponseModel
} from '../model/data.model';
import {
  DependencyEditorService
} from '../shared/dependency-editor.service';
import {
  DependencySnapshot
} from '../utils/dependency-snapshot';

@Component({
  selector: 'app-add-dependency',
  styleUrls: ['./add-dependency.component.less'],
  templateUrl: './add-dependency.component.html'
})

export class AddDependencyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dependencies: Array < ComponentInformationModel > ;
  @Input() existDependencies: Array < DependencySnapshotItem > ;
  @ViewChild('PackagePreview') modalPackagePreview: any;

  public dependencySearchString: string;
  public dependencySearchResult: Array < DependencySearchItem > = [];
  public isLoading = false;
  public categorySearchResult: Array < CategorySearchItem > = [];
  public categoryResult = [];
  public tagZero = 0;

  public searchKey = '';
  public selected: string;
  public suggestions: Array < any > = [];
  public dependenciesData: Array < any > = [];
  public masterTags: Array < any > = [];
  public selectedTags = new Set();
  public categories = [];
  public cveTemporaryData: CveResponseModel;
  public cveName: any = [];



  // private searchDepsUrl = 'https://recommender.api.openshift.io/api/v1/component-search/';
  private searchDepsUrl = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/component-search/';
  // private categoryUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/categories/';
  private categoryUrl = 'https://gist.githubusercontent.com/sanketpathak/9c431733f0b75623e6c88ae239e9813b/raw/494965a93039376f40116378c23404c1a5aeb5dd/vertx_package.json';
  private getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';

  constructor(private service: DependencyEditorService) {}

  ngOnInit() {

  }

  ngOnChanges() {
  }

  getDependencies() {
    this.isLoading = true;
    this.service.getDependencies(this.searchDepsUrl + this.dependencySearchString)
      .subscribe((response: any) => {
        this.dependencySearchResult = response['result'];
        this.isLoading = false;
      });
  }

  getCategories() {
    this.isLoading = true;
    this.service.getCategories(this.categoryUrl) // + '/vertx')
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
    const payload = {};
    let j = 0;
    const category: Array < DependencySnapshotItem > = [];
    this.categoryResult.forEach(i => {
      i.package.map((k) => {
        category['package'] = k.name;
        category['version'] = k.version;
        j++;
        if (j === 7) {
          payload['_resolved'] = category;
          payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
          payload['request_id'] = DependencySnapshot.REQUEST_ID;
          j = 0;
        }
      });
    });
    return payload;
  }

  getCategoriesSecurity(payload: any) {
    this.service.getDependencyData(this.getCveUrl, payload)
      .subscribe((response: CveResponseModel) => {
        this.cveTemporaryData = response;
        if (this.cveTemporaryData) {
          let count = -1;
          this.cveTemporaryData.result.forEach(item => {
            count++;
            if (item.cve) {
              if (item.cve !== null) {
                this.cveName.push([
                  item.cve.details, // cve:
                  item.package // package:
                ]);
              }
            }
          });
        }
      });
  }

  listenInputSearch() {
    if (this.dependencySearchString === '') {
      this.dependencySearchResult = [];
    }
  }

  addDependency(depItem: DependencySearchItem) {
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

  removeDependency(dependency) {
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
    //   if (this.selected) {
    //     this.dependencies = [];
    //     // this.categories = [];
    //     const tags = this.selected.split(',').map(item => {
    //       return item.trim();
    //     });
    //     tags.forEach(i => {
    //       this.dependenciesData.map(d => {
    //         if (d['category'].indexOf(i) !== -1) {
    //           let _flag = true;
    //           this.dependencies.map(tmp => {
    //             if (tmp.name === d.name) {
    //               _flag = false;
    //             }
    //           });
    //           if (_flag) {
    //             this.dependencies.push(d);
    //           }
    //         }
    //       });
    //     });
    //     // this.calculateCategories(this.dependencies);
    //   }
    //   if (this.selected.toLocaleLowerCase().indexOf('all') !== -1){
    //     this.dependencies = this.dependenciesData;
    //   }
  }

  handleUserInputKeyPress(event: KeyboardEvent): void {
    //   const key: string = event.key.trim();
    //   if (key && key.trim() === ',') {
    //     this.searchKey = '';
    //     this.suggestions = [];
    //   } else {
    //     if (key === 'Enter') {
    //       this.searchKey = '';
    //       this.suggestions = [];
    //       this.showDependency();
    //     } else if (key === 'Backspace') {
    //       if (this.searchKey !== '') {
    //         this.searchKey = this.searchKey.slice(0, -1);
    //         if (this.searchKey !== '') {
    //           this.suggestions = [];
    //         }
    //       } else {
    //         this.suggestions = [];
    //       }
    //     } else {
    //       this.searchKey += key.trim();
    //     }
    //     if (this.searchKey) {
    //       this.suggestions = this.masterTags.filter(tag => {
    //         return tag.indexOf(this.searchKey) !== -1;
    //       });
    //     }
    //   }
    // }
    // public tagClick(tag: string) {
    //   if (tag !== 'All') {
    //     if (this.selectedTags.has('All')) {
    //       this.selectedTags.delete('All');
    //     }
    //     if (!this.selectedTags.delete(tag)) {
    //       this.selectedTags.add(tag);
    //     }
    //   } else {
    //     if (this.selectedTags.has(tag)) {
    //       this.selectedTags.clear();
    //     } else {
    //       this.selectedTags.clear();
    //       this.selectedTags.add(tag);
    //     }
    //   }
    //   this.selected = Array.from(this.selectedTags).join(', ');
    //   this.showDependency();
  }

  public addedTags() {
    let count = 0;
    this.tagZero = 0;
    this.categoryResult.forEach(i => {
      count++;
      this.tagZero = this.tagZero + count;
      i.package.forEach(x => {
        this.masterTags['ecosystem'] = DependencySnapshot.ECOSYSTEM;
        this.masterTags['version'] = x.version;
        this.masterTags['name'] = x.name;
      });
    });
  }

}
