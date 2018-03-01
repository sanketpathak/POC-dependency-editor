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
import { CveResponseModel } from '../model/data.model';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.less']
})

export class SecurityComponent implements OnInit, OnChanges {
  @Input() cveData: CveResponseModel;

  public title = 'Security Alert';
  public icon = 'fa fa-shield';
  public noOfCves = 0;
  public hasIssue = false;
  public toHave: boolean = false;
  public secureIssue: boolean = false;
  public itSecurity: boolean = true;
  public cveName: any = [];
  
  constructor() {}

  ngOnChanges() {
    this.hasIssue = false;
    this.secureIssue = false;
    this.cveName = [];
    if (this.cveData) {debugger;
      this.noOfCves = 0;
      let count = -1;
      this.itSecurity = true;
      this.cveData.result.forEach(item => {
        count++;
        if (item.cve) {debugger;
          this.noOfCves++;
          this.hasIssue = true;
          this.secureIssue = true;
          // this.cveName[this.noOfCves] = {item.cve,item.package}
          // this.cveName[this.noOfCves] = this.cveName.assign(item.cve, item.package);
          console.log("count for cve",count);
          // this.cveData.result.map(i => {
            
              if(item.cve !== null){
            this.cveName.push([
                item.cve.details, //cve: 
                item.package //package: 
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
      });debugger;
      if(this.noOfCves>0){this.itSecurity = false;}
    } else {
      this.noOfCves = null;
    }
  }

  ngOnInit() {

  }

  public getShow(event) {
    this.toHave = event.toShow;
    console.log("show toHave variable ",this.toHave);
  }

}
