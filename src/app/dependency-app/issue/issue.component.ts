import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less']
})

export class IssueComponent implements OnInit {
  
  @Input() issue_name : string;
  @Input() issue_symbol : string;
  @Input() issue_status : string;


  constructor() { }

  ngOnInit() {
    console.log("issue_name :"+this.issue_name);
    console.log("issue_symbol :"+this.issue_symbol);
    console.log("issue_status :"+this.issue_status);
  }

}
