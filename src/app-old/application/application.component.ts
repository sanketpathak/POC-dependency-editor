import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
// import { BrowserModule } from '@angular/platform-browser';
import * as c3 from 'c3';


@Component({
  selector: 'app-application',
  styleUrls: ['./application.component.less'],
  templateUrl: './application.component.html'
})
export class ApplicationComponent implements OnInit {
  @Input('component') component;
  @Output() onCloseEmitter = new EventEmitter();
  public donutData: any;
  public showtd: boolean = false;
  public symbol: string = 'fa fa-sort-desc';
  // public trial: any;
  public showOnScreen: boolean = true;
  public c1: any;
  public d1: any;
  public o1: any;

  public charts: any = {};


  constructor() { }

  status: any = {
    isFirstOpen: true,
    isFirstDisabled: false
  };

  ngOnInit() {
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
        ['data1', 30],
        ['data2', 120],
    ],
    type : 'donut'
  };

  this.charts['options'] = {
    donut: {
        title: "Iris Petal Width"
    }
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
}
