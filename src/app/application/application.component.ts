import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ApplicationServices } from './application.component.service';
// import { BrowserModule } from '@angular/platform-browser';
import * as c3 from 'c3';


@Component({
  selector: 'app-application',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./application.component.less'],
  providers: [ApplicationServices],
  templateUrl: './application.component.html'
  
})
export class ApplicationComponent implements OnInit, OnChanges {
  @Input('component') component;
  @Output() onCloseEmitter = new EventEmitter();

  @Input('dependencies') dependencies;


  public donutData: any;
  public showtd: boolean = false;
  public symbol: string = 'fa fa-sort-desc';
  public showOnScreen: boolean = true;
  public l1: string;
  public l2: string;
  public l3: string;
  public rel: string = "lgplv3+";
  public r_l:number;
  public moreInfoText: string = "";
  public cve=0;
  public dep: Array<any> = [];
  public securityConflicts = ["aws-maven"];
  public isSecurityIssueVar:string  = '';

  
  public compDep = new Set();
 
  public charts: any = {};

  public isSecurityIssue(): void {
    console.log("I am running");
    this.isSecurityIssueVar = '';            
    if(this.dependencies)
    this.dependencies['dependencies'].forEach((d) => {
      if (this.securityConflicts.indexOf(d.name) !== -1){
        this.isSecurityIssueVar = d.name;      
        this.cve = 1;       
      }
    })
  }
  constructor(private applicationServices: ApplicationServices) { }

  status: any = {
    isFirstOpen: true,
    isFirstDisabled: false
  };

public moreInfo() {
this.moreInfoText = "some description of CVE";
}

public addItem(dependency):void{

}
processPackages(): void {
    const packageInfo: Observable<any> = this.applicationServices.getPackages();
    packageInfo.subscribe((data) => {
        console.log(data);
        if (data) {
            this.dep = data['dependencies'];
        }
    });
}

  ngOnInit() {
    this.processPackages();
    this.l1="lgplv2.1+";
    this.l2="Apache2.0";
    this.l3="BSD New";
    this.r_l=1;
  //   donutChartSmallConfig.d1 = { 
  //     columns: [ 
  //       ['data1', 10], 
  //       ['data2', 45], 
  //       ['data3', 45]
  //      ],
  // };

  //  donutChartSmallConfig.c1 = {
  //   // 'chartId': 'chartOne',
  //   'legend': {
  //     "show":true,
  //     "position": 'right'},
    
  //   donut: {
  //     title: "3 Liscenses"
  //   },
  //   'onClickFn': function (d, i) {
  //     alert("You clicked on donut arc: " + d.id);
  //    }
  // };

  //  donutChartSmallConfig.o1 = {
  //   type: 'donut',
  //   size : {
  //     width: 250,
  //     height: 115
  //   },

  //   color : {
  //     'Apache2.0': '#0088ce',     // blue
  //     'MIT Liscense': '#3f9c35', // green
  //     'EPL1.0': '#ec7a08',     // orange
  //   },
  // };

  // var donutChartSmallConfig = c3ChartDefaults.getDefaultDonutConfig('8');
  // donutChartSmallConfig.bindto = '#donut-chart-7';
  // donutChartSmallConfig.tooltip = {show: true};
  // donutChartSmallConfig.data = this.d1;
  // donutChartSmallConfig.legend = {
  //   show: true,
  //   position: 'right'
  // };
  // donutChartSmallConfig.size = {
  //   width: 250,
  //   height: 115
  // };
  

  // var donutChartSmall = c3.generate(donutChartSmallConfig); 

  // this.c1 = {
  //     axis: {
  //         rotated: true,
  //     },
  // };

  // this.o1 = {
  //     size: {
  //         width: 370,
  //         height: 170,
  //     },

  //     color: {
  //         pattern: ['#0000FF','#e27602','#028802']
  //     },

  // }

  this.charts['data'] = {
    columns: [
        [this.l1, 12.5],
        [this.l2, 75],
        [this.l3, 12.5]        
    ],
    type : 'donut'
  };

      this.charts['options'] = {
          donut: {
              title: "3 Licences",
              width: 12        
          },
          size: {
              height:200,
              width :225
          }	

      };
      this.charts['configs'] = {
          legend: {
              show: true,
              position: 'right'
          },
      };

  // var chart = c3.generate(
  //   {
  //   bindto: '#donut-chart-7',
  //   legend : {
  //       show: true,
  //       position: 'right'
  //     },
  //     size : {
  //       height:300,
  //       width :250
  //     },
  //     data: {
  //       columns: [
  //         ['Apache 2.0', 40],
  //         ['EPL1.0', 40],
  //         ['MIT Liscense', 20]
  //        ],
  //        type : 'donut',
  //        onclick: function (d, i) { console.log("onclick", d, i); },
  //        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
  //        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
  //        },
  //        donut: { title: "3 Licences",
  //        width: 15
  //        },
  //       });
  //


  //   var c3ChartDefaults = c3.generate({
  //     this.donutData = {
  //     type : 'donut',
  //     colors: {
  //       'Apache2.0' : $.pfPaletteColors.blue,
  //       'EPL1.0' : $.pfPaletteColors.orange,
  //       'MIT Liscense' : $.pfPaletteColors.green,
  //     },
  //     columns: [
  //       ['EPL 1.0', 2],
  //       ['MIT Liscense', 3],
  //       ['Apache 2.0', 1]
  //     ],
  //     onclick: function (d, i) { console.log("onclick", d, i); },
  //     onmouseover: function (d, i) { console.log("onmouseover", d, i); },
  //     onmouseout: function (d, i) { console.log("onmouseout", d, i); }
  //   },
  //   donut: {
  //     title: "3 Liscences"
  //   }
  // });
    // Small Donut Chart
    // var donutChartSmallConfig = c3ChartDefaults.getDefaultDonutConfig('8');
    // donutChartSmallConfig.bindto = '#donut-chart-7';
    // donutChartSmallConfig.tooltip = {show: true};
    // donutChartSmallConfig.data = this.donutData;
    // donutChartSmallConfig.legend = {
    //   show: true,
    //   position: 'right'
    // };
    // donutChartSmallConfig.size = {
    //   width: 250,
    //   height: 115
    // };
    
  
    // var donutChartSmall = c3.generate(donutChartSmallConfig);
  }

  public emitCloseEvent(element: Element): void {
    this.showOnScreen = false;
    console.log(this.showOnScreen);
    this.onCloseEmitter.emit([this.component, element]);
}

  private toggle() {
    this.showtd = !this.showtd;
    console.log();
    if (this.showtd === true) {
        this.symbol = 'fa fa-sort-asc nom';
    }
    else {
        this.symbol = 'fa fa-sort-desc nom';
    }
  }


  ngOnChanges(): void {
    this.compDep.add({"name": "A", "latest_version": "2.6.0"});
    this.compDep.add({"name": "B", "latest_version":"1.3.4"});  
    if (this.dependencies) {
      console.log(this.dependencies);
    }
  }
}
