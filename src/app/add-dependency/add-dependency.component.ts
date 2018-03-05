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
  TagInputModule
} from 'ngx-chips';
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
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.less']
})

export class AddDependencyComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dependencies: Array < ComponentInformationModel > ;
  @Input() existDependencies: Array<DependencySnapshotItem>;
  @ViewChild('PackagePreview') modalPackagePreview : any;
  
  public dependencySearchString: string;
  public dependencySearchResult: Array < DependencySearchItem > = [];
  public isLoading = false;
  public categorySearchResult: Array < CategorySearchItem > = [];
  public categoryResult = [];
  public tagZero: number = 0;

  public search_key = '';
  public selected: string;  
  public suggestions: Array<any> = [];
  public dependenciesData: Array<any> = [];
  public masterTags: Array<any> = [];
  public selectedTags = new Set();
  public categories = [];
  public cveTemporaryData: CveResponseModel;
  public cveName: any = [];
  
  
    
  // private searchDepsUrl = 'https://recommender.api.openshift.io/api/v1/component-search/';
  private searchDepsUrl = 'http://bayesian-api-bayesian-preview.b6ff.rh-idev.openshiftapps.com/api/v1/component-search/';
  // private categoryUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/categories/';
  private categoryUrl = 'https://gist.githubusercontent.com/sanketpathak/9c431733f0b75623e6c88ae239e9813b/raw/e325de8129a6c135813fb23804ef33e56aec783a/vertx_package.json';
  private getCveUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-cve-analyses/';
  
  constructor(private service: DependencyEditorService) {}

  ngOnInit() {

  }

  ngOnChanges() {
    console.log(this.dependencies);
  }

  getDependencies() {
    this.isLoading = true;
    this.service.getDependencies(this.searchDepsUrl + this.dependencySearchString)
      .subscribe((response: any) => {
        this.dependencySearchResult = response['result'];
        console.log('rrrrrrrrrrrrrrrrrrrresponse', this.dependencySearchResult);
        this.isLoading = false;
      });
  }

  getCategories() {debugger;
    this.isLoading = true;
    this.service.getCategories(this.categoryUrl)// + "vertx")
      .subscribe((response: any) => {
        this.categorySearchResult = response['categories'];
        this.isLoading = false;
        this.categoryResult = [];
        for (let key in this.categorySearchResult) {
         if (this.categorySearchResult.hasOwnProperty(key)) {
          this.categoryResult.push(this.categorySearchResult[key]);
         }
        }
        // const payload ;
        const p = this.getCategoryPayload();
        console.log('--------------------------', p);
        this.getCategoriesSecurity(p);
        this.addedTags();
        // this.masterTags = this.masterTags.concat(this.categorySearchResult.sort());
        console.log('category search result', this.categoryResult, this.categoryResult.length);
        console.log('rrrrrrrrrrrrrrrrrrrresponse', this.dependencySearchResult);
      });
  }

  getCategoryPayload() {
    const payload = {};
    let j = 0;
    const category: Array<DependencySnapshotItem> = [];
     this.categoryResult.forEach( i => {console.log('cat , i ', this.categoryResult[i], i);
      // i.package.foreach(k => {
      i.package.map((k) => {debugger;
          // category.push([
            category['package'] = k.name;
            category['version'] = k.version;
          // ]);
          console.log('categories ==>', category,k);
          j++
        if(j === 7) {
          payload['_resolved'] = category;
          payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
          payload['request_id'] = DependencySnapshot.REQUEST_ID;
          j = 0;
          // category = [];
          console.log('Initial payload is :', payload);
          // return payload;
        }
      });
    })
    return payload;
}

  getCategoriesSecurity(payload: any) {console.log('payload for categories', payload);
    this.service.getDependencyData(this.getCveUrl, payload)
    .subscribe((response: CveResponseModel) => {
      console.log('cve data', response);
      this.cveTemporaryData = response;
      console.log('this.cveTemporaryData =', this.cveTemporaryData);
      if (this.cveTemporaryData) {
        let count = -1;
        this.cveTemporaryData.result.forEach(item => {
          count++;
          if (item.cve) {
            // this.hasIssue = true;
            // this.secureIssue = true;
            // this.cveName[this.noOfCves] = {item.cve,item.package}
            // this.cveName[this.noOfCves] = this.cveName.assign(item.cve, item.package);
            console.log('count for cve', count);
            // this.cveData.result.map(i => {
  
                if (item.cve !== null) {
              this.cveName.push([
                  item.cve.details, // cve:
                  item.package // package:
              ]);
              }
          // }).forEach(j => this.cveName.push(j));
  
          // Object.keys(this.item).forEach(k => {
          //   this.cveName.push([
          //     k.details.,
          //     this.licenseCount[k] * 100 / this.allLicenses.length
          //   ]);
          // });
            // this.cveName[item.package] = this.cveName[item.package];
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
    // this.categorySearchResult = [];
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
    this.service.removeDependency(dependency); console.log('remove of added dependency', dependency);
  }

  public showPackageModal(event: Event) {
    this.modalPackagePreview.open();
    this.getCategories();
  }
  public closemodal() {
    this.modalPackagePreview.close();
  }

  public showDependency() {debugger;
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
  //   console.log(event);
  //   const key: string = event.key.trim();
  //   if (key && key.trim() === ',') {
  //     this.search_key = '';
  //     this.suggestions = [];
  //   } else {
  //     if (key === 'Enter') {
  //       this.search_key = '';
  //       this.suggestions = [];
  //       this.showDependency();
  //     } else if (key === 'Backspace') {
  //       if (this.search_key !== '') {
  //         this.search_key = this.search_key.slice(0, -1);
  //         if (this.search_key !== '') {
  //           this.suggestions = [];
  //         }
  //       } else {
  //         this.suggestions = [];
  //       }
  //     } else {
  //       this.search_key += key.trim();
  //     }
  //     if (this.search_key) {
  //       this.suggestions = this.masterTags.filter(tag => {
  //         return tag.indexOf(this.search_key) !== -1;
  //       });
  //     }
  //   }
  //   console.log(this.search_key);
  // }
  // public tagClick(tag: string) {debugger;
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

  public addedTags(){debugger;
    // Array.prototype.forEach.call(this.categoryResult, i => {
      let count = 0;this.tagZero = 0;
      this.categoryResult.forEach(i => {count++;
      this.tagZero = this.tagZero + count;
      console.log('categary name', i); debugger;
        i.package.forEach( x => {
          // this.masterTags.push([
          this.masterTags['ecosystem'] = DependencySnapshot.ECOSYSTEM;
          this.masterTags['version'] = x.version;
          this.masterTags['name'] = x.name;
        // ])
        } );
        // i.count

    });
    console.log('This is master tag list', this.masterTags);
  }
  // public calculateCategories(dependencies) {
  //   const tempCategories = [];
  //   this.categorySearchResult.forEach(k => { //.map((d) => 
  //     // tempCategories[d.category] = tempCategories[d.category] + 1 || 1;
  //     // tempCategories['All'] = Object.keys(tempCategories).length - 1;
  //     tempCategories.push([
  //       k,
  //       k.package_count
  //     ]);
  //   });
  //   for (const key in tempCategories) {
  //     if (key !== 'All') {
  //       this.categories.push([key, tempCategories[key]]);
  //     }
  //   }
  //   this.categories.sort(function (a, b) {
  //     if (a[0] < b[0]) { return -1; }
  //     if (a[0] > b[0]) { return 1; }
  //     return 0;
  //   });
  //   this.categories.unshift(['All', tempCategories['All']]);
  //   // this.categoriesHeight = this.offsetHeight + 20 * Object.keys(tempCategories).length;
  // }
}
