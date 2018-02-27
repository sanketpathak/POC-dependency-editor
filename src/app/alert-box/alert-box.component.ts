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
import * as c3 from 'c3';
import { StackLicenseAnalysisModel } from '../model/data.model';

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.less']
})

export class AlertBoxComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() colored: string;
  @Input() issueStatus: string;
  @Input() issueSymbol: string;
  @Input() secureIssue: boolean;
  @Input() licenseIssue: boolean;
  @Input() itSecurity: boolean;
  @Input() licenseAll: Array<string> = [];
  // @Input() toShow:boolean;
  @Input() hasIssue: boolean;
  @Input() cveName= [];
  @Input() liData = [];

  @Input() charts: any = {};
  public isLoading = false;
  public cveId = [];
  public cvePackage = [];
  
  
  constructor() { }

  ngOnInit() {
    console.log('issue status  ==', this.issueStatus);
    console.log('issue symbol', this.issueSymbol);    
    // this.displayLicenses();
  }
  
  ngOnChanges() { console.log("loading is ",this.isLoading);
  console.log('issue status  ==', this.issueStatus);
  console.log('issue symbol', this.issueSymbol);    
    // this.displayLicenses();
    console.log(this.licenseIssue);
    debugger;
    if (this.issueStatus === null) {
      this.isLoading = true;
    } else if (typeof this.issueStatus === 'string' && this.issueStatus) {
      this.isLoading = false;
    } else if (typeof this.issueStatus === 'number') {
      this.isLoading = false;
    }
    this.getCves();console.log("loading is ",this.isLoading);
    console.log("liscence issue",this.licenseIssue);
    console.log("security issue",this.secureIssue);
    console.log("Bcoz It's security issue",this.itSecurity);
    console.log("cve Name in alert box",this.cveName,this.cveName.length);
    console.log("li variable data ->",this.liData);
    console.log("chart data = ",this.charts['data']);
  }

  public get_secure() {
      this.secureIssue = true;
      console.log('security issue' + this.secureIssue);
    }

    public getCves() {this.cveId = [];
      for(let i=0,j=0;i<this.cveName.length;i++){
        this.cveName[i][0].forEach(e => {
          // j++;
          this.cveId.push({
             "id" : e.cve_id,
            "package":this.cveName[i][1]
          });
          // this.cveId[j] = e.cve_id;
          // this.cvePackage[j] = this.cveName[i][1]
        });
        
      }console.log("cve id and packages",this.cveId,this.cvePackage);
    }
  
    // public displayLicenses(): void {debugger;
    //   this.charts['data'] = {
    //     columns: this.liData,
    //   //   columns: [
    //   //     // ['data1', 30],
    //   //     // ['data2', 70],
    //   //     this.liData,
    //   // ],
    //     type: 'donut'
    //   };
    //   this.charts['options'] = {
    //     donut: {
    //       title: ' Licenses',// + this.licenseData.length
    //       width: 11,
    //       label: {
    //         format: function(value) {
    //           return;
    //         }
    //       }
    //     },
    //     size: {
    //       height: 120,
    //       width: 190
    //     }
    //   };
    //   this.charts['configs'] = {
    //     legend: {
    //       show: true,
    //       position: 'right'
    //     }
    //   };
    // }
    
    

}
