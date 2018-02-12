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

@Component({
  selector: 'app-alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.less']
})

export class AlertBoxComponent implements OnInit {
  @Input() title: string;
  @Input() colored: string;
  @Input() issueStatus: string;
  @Input() issueSymbol: string;
  @Input() secureIssue: boolean;
  @Input() licenseIssue: boolean;
  @Input() licenseData: string;
   
  public charts: any = {};
  
  constructor() { }

  ngOnInit() {
    console.log('alert_symbol', this.issueSymbol);    
    console.log("licenseData : " + this.licenseData);
  }
  public get_secure() {
      this.secureIssue = true;
      console.log('security issue' + this.secureIssue);
    }
  
    public displayLicenses(): void {
      this.charts['data'] = {
        // columns: this.licenseData,
        columns: [
          ['data1', 30],
          ['data2', 120],
      ],
        type: 'donut'
      };
      this.charts['options'] = {
        donut: {
          title: this.licenseData.length + ' Licenses',
          width: 12,
          label: {
            format: function(value) {
              return;
            }
          }
        },
        size: {
          height: 200,
          width: 225
        }
      };
      this.charts['configs'] = {
        legend: {
          show: true,
          position: 'right'
        }
      };
    }

}
