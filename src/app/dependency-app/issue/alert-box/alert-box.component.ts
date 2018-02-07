import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'alert-box',
  templateUrl: './alert-box.component.html',
  styleUrls: ['./alert-box.component.less']
})

export class AlertBoxComponent implements OnInit {
  
  @Input() alert_title: string;
  @Input() colored: string;
  @Input() issue_status : string;
  @Input() issue_symbol: string;
  @Input() secure_issue: boolean;

  constructor() { }

  ngOnInit() {
    console.log("alert_symbol"+this.issue_symbol);
  }
  public get_secure() {
      this.secure_issue = true;
      console.log("security issue" + this.secure_issue);
    }

}
