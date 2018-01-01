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

@Component({
  selector: 'app-packages',
  styleUrls: ['./packages.component.less'],
  providers: [PackagesServices],
  templateUrl: './packages.component.html'
})
export class PackagesComponent implements OnInit {
  @Output('onPackageSelect') onPackageSelect = new EventEmitter();
  @Input('mygui') appName: string;
  public dependencies: Array<any> = [];
  public dependenciesData: Array<any> = [];
  public masterTags: Array<any> = [
    'web',
    'spring',
    'database',
    'starter',
    'aws',
    'maven',
    'openshift',
    'middleware',
    'express',
    'test',
    'debug'
  ];
  public selectedPackages = new Set();
  public unselectedPackages = new Set();
  public selected: string;
  public offsetHeight = 110;
  public categoriesHeight = 120;
  public categories = {};
  public objectKeys = Object.keys;
  public selectedTags = new Set();
  public suggestions: Array<any> = [];
  public selectedDependenciesObject = new Set();
  public search_key = '';
  public companionPackages: Array<any> = [];
  public compDep: Array<any> = [];
  public ecosystem = 'maven';

  constructor(private packagesServices: PackagesServices) {}

  public isDependencySelected(event, dependency: string): void {
    if (event.target.checked) {
      this.selectedPackages.add(dependency['name']);
      this.selectedDependenciesObject.add(dependency);
      this.unselectedPackages.delete(dependency['name']);
      console.log(dependency);
      dependency['topic_list'].forEach(i => {
        this.selectedTags.add(i);
      });
    } else {
      this.selectedTags.delete('All');
      this.selectedDependenciesObject.delete(dependency);
      this.unselectedPackages.add(dependency['name']);
      this.selectedPackages.delete(dependency['name']);
      console.log(dependency);
      dependency['topic_list'].forEach(i => {
        this.selectedTags.delete(i);
      });
      this.selectedPackages.forEach(i => {
        this.dependencies.map(d => {
          if (d['name'] === i) {
            d['topic_list'].forEach(j => {
              this.selectedTags.add(j);
            });
          }
        });
      });
    }
    console.log(this.selectedPackages);

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
      }
    });
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
        this.selectedPackages.forEach(i => {
          this.unselectedPackages.add(i);
        });
        this.selectedPackages.clear();
      }
      if (!this.selectedTags.delete(tag)) {
        this.selectedTags.add(tag);
        this.selectedTags.forEach(i => {
          this.dependencies.map(d => {
            if (d['topic_list'].indexOf(i) !== -1) {
              this.selectedPackages.add(d['name']);
              this.unselectedPackages.delete(d['name']);
            }
          });
        });
      } else {
        this.selectedPackages.clear();
        this.selectedTags.forEach(i => {
          this.dependencies.map(d => {
            if (d['topic_list'].indexOf(i) !== -1) {
              this.selectedPackages.add(d['name']);
              this.unselectedPackages.delete(d['name']);
            }
          });
        });
      }
    } else {
      if (this.selectedTags.has(tag)) {
        this.selectedTags.clear();
        this.selectedPackages.clear();
        this.dependencies.map(d => {
          this.unselectedPackages.add(d['name']);
        });
      } else {
        this.selectedTags.clear();
        this.selectedTags.add(tag);
        this.unselectedPackages.clear();
        this.dependencies.map(d => {
          this.selectedPackages.add(d['name']);
        });
      }
    }
    this.moveSelectedPackages();
    this.onPackageSelect.emit({
      dependencies: this.selectedDependenciesObject,
      companionPackages: this.shuffle(this.compDep)
    });
    console.log(this.selectedTags);
  }
  public showDependency() {
    // this.dependencies = [];
    // this.categories = {};
    const tags = this.selected.split(',').map(item => {
      return item.trim();
    });
    tags.forEach(i => {
      this.dependenciesData.map(d => {
        if (d['topic_list'].indexOf(i) !== -1) {
          let _flag = true;
          this.dependencies.map(tmp => {
            if (tmp.name === d.name) {
              _flag = false;
            }
          });
          if (_flag) {
            this.dependencies.push(d);
            d.topic_list.forEach(element => {
              this.categories[element] = this.categories[element] + 1 || 1;
              this.categories['All'] = this.categories['All'] + 1 || 1;
              this.categories = Object.keys(this.categories)
                .sort((a, b) => this.categories[b] - this.categories[a])
                .reduce(
                  (_sortedObj, key) => ({
                    ..._sortedObj,
                    [key]: this.categories[key]
                  }),
                  {}
                );
              this.categoriesHeight =
                this.offsetHeight + 20 * Object.keys(this.categories).length;
            });
          }
        }
      });
    });
    console.log(tags);
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
}
