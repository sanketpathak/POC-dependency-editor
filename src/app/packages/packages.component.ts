import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PackagesServices } from './packages.component.service';
import { concat } from 'rxjs/operator/concat';

@Component({
  selector: 'app-packages',
  styleUrls: ['./packages.component.less'],
  providers: [PackagesServices],
  templateUrl: './packages.component.html'
})
export class PackagesComponent implements OnInit {
  @Output('onPackageSelect') onPackageSelect = new EventEmitter();
  @Input('mygui') appName: string;
  @Input('deletedDependencies') deletedDependencies;
  @Input('showList') showList;
  public dependencies: Array<any> = [];
  public dependenciesData: Array<any> = [];
  public masterTags: Array<any> = [
    'web',
    'cache',
    'memcached',
    'client',
    'spring',
    'database',
    'starter',
    'aws',
    'maven',
    'openshift',
    'middleware',
    'express',
    'test',
    'logging',
    'debug'
  ];
  public selectedPackages = new Set();
  public unselectedPackages = new Set();
  public selected: string;
  public offsetHeight = 90;
  public categoriesHeight = 100;
  public categories = [];
  public objectKeys = Object.keys;
  public selectedTags = new Set();
  public suggestions: Array<any> = [];
  public selectedDependenciesObject = new Set();
  public search_key = '';
  public companionPackages: Array<any> = [];
  public compDep: Array<any> = [];
  public ecosystem = 'maven';

  constructor(private packagesServices: PackagesServices) { }

  public isDependencySelected(event, dependency: string): void {
    if (event.target.checked) {
      this.selectedPackages.add(dependency['name']);
      this.selectedDependenciesObject.add(dependency);
      this.unselectedPackages.delete(dependency['name']);
      // console.log(dependency);
      // dependency['topic_list'].forEach(i => {
      //   this.selectedTags.add(i);
      // });
    } else {
      // this.selectedTags.delete('All');
      this.selectedDependenciesObject.delete(dependency);
      this.unselectedPackages.add(dependency['name']);
      this.selectedPackages.delete(dependency['name']);
      console.log(dependency);
      // dependency['topic_list'].forEach(i => {
      //   this.selectedTags.delete(i);
      // });
      // this.selectedPackages.forEach(i => {
      //   this.dependencies.map(d => {
      //     if (d['name'] === i) {
      //       d['topic_list'].forEach(j => {
      //         this.selectedTags.add(j);
      //       });
      //     }
      //   });
      // });
    }
    // console.log(this.selectedPackages);

    this.onPackageSelect.emit({
      dependencies: this.selectedDependenciesObject,
      companionPackages: this.shuffle(this.compDep)
    });
  }

  processPackages(): void {
    const packageInfo: Observable<any> = this.packagesServices.getPackages(
      this.ecosystem
    );
    packageInfo.subscribe(data => {
      console.log(data);
      if (data) {
        this.dependenciesData = data['dependencies'];
        this.dependencies = this.dependenciesData;
        this.calculateCategories(this.dependencies);
      }
    });
  }

  public calculateCategories(dependencies) {
    const tempCategories = {};
    this.dependencies.map((d) => {
      tempCategories[d.category] = tempCategories[d.category] + 1 || 1;
      tempCategories['All'] = Object.keys(tempCategories).length - 1;
    });
    for (const key in tempCategories) {
      if (key !== 'All') {
        this.categories.push([key, tempCategories[key]]);
      }
    }
    this.categories.sort(function (a, b) {
      if (a[0] < b[0]) { return -1; }
      if (a[0] > b[0]) { return 1; }
      return 0;
    });
    this.categories.unshift(['All', tempCategories['All']]);
    this.categoriesHeight = this.offsetHeight + 20 * Object.keys(tempCategories).length;
  }

  processCompanionPackages(): void {
    const packageInfo: Observable<
      any
      > = this.packagesServices.getCompanionPackages(this.ecosystem);
    packageInfo.subscribe(data => {
      console.log(data);
      if (data) {
        this.compDep = data['dependencies'];
      }
    });
  }
  processMasterTags(): void {
    const masterTags: Observable<any> = this.packagesServices.getMasterTags();
    masterTags.subscribe(data => {
      this.masterTags = this.masterTags.concat(data.tag_list.sort());
    });
  }

  public moveSelectedPackages() {
    this.selectedDependenciesObject.clear();
    this.selectedPackages.forEach(p => {
      this.dependencies.map(d => {
        if (p === d.name) {
          this.selectedDependenciesObject.add(d);
        }
      });
    });
  }

  public shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    this.companionPackages = array.slice(0, 2);
    return new Set(this.companionPackages);
  }

  public tagClick(tag: string) {
    if (tag !== 'All') {
      if (this.selectedTags.has('All')) {
        this.selectedTags.delete('All');
      }
      if (!this.selectedTags.delete(tag)) {
        this.selectedTags.add(tag);
      }
    } else {
      if (this.selectedTags.has(tag)) {
        this.selectedTags.clear();
      } else {
        this.selectedTags.clear();
        this.selectedTags.add(tag);
      }
    }
    this.selected = Array.from(this.selectedTags).join(', ');
    this.showDependency();
  }


  public showDependency() {
    if (this.selected) {
      this.dependencies = [];
      // this.categories = [];
      const tags = this.selected.split(',').map(item => {
        return item.trim();
      });
      tags.forEach(i => {
        this.dependenciesData.map(d => {
          if (d['category'].indexOf(i) !== -1) {
            let _flag = true;
            this.dependencies.map(tmp => {
              if (tmp.name === d.name) {
                _flag = false;
              }
            });
            if (_flag) {
              this.dependencies.push(d);
            }
          }
        });
      });
      // this.calculateCategories(this.dependencies);
    }
    if (this.selected.toLocaleLowerCase().indexOf('all') !== -1){
      this.dependencies = this.dependenciesData;
    }
  }

  handleUserInputKeyPress(event: KeyboardEvent): void {
    console.log(event);
    const key: string = event.key.trim();
    if (key && key.trim() === ',') {
      this.search_key = '';
      this.suggestions = [];
    } else {
      if (key === 'Enter') {
        this.search_key = '';
        this.suggestions = [];
        this.showDependency();
      } else if (key === 'Backspace') {
        if (this.search_key !== '') {
          this.search_key = this.search_key.slice(0, -1);
          if (this.search_key !== '') {
            this.suggestions = [];
          }
        } else {
          this.suggestions = [];
        }
      } else {
        this.search_key += key.trim();
      }
      if (this.search_key) {
        this.suggestions = this.masterTags.filter(tag => {
          return tag.indexOf(this.search_key) !== -1;
        });
      }
    }
    console.log(this.search_key);
  }
  public changeVersion(dependency: string, ver: string): void {
    dependency['latest_version'] = ver;
  }
  public test(varible) {
    console.log(varible);
    console.log(this.selected);
  }
  ngOnInit() {
    console.log(this.ecosystem);
    this.processPackages();
    this.processCompanionPackages();
    if (this.appName) {
      if (this.appName.toLocaleLowerCase().indexOf('node') !== -1) {
        this.ecosystem = 'node';
      } else {
        this.ecosystem = 'maven';
      }
    }
  }
  ngOnChanges() {
    if (this.deletedDependencies) {
      console.log(this.deletedDependencies['packages']['name']);
      this.isDependencySelected(
        { target: { checked: false } },
        this.deletedDependencies['packages']
      )
    }
  }
}
