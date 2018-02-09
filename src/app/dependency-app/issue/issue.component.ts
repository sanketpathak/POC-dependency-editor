import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less']
})

export class IssueComponent implements OnInit {
  @Input() issueName: string;
  @Input() issueSymbol: string;
  @Input() issueStatus: string;

  constructor() { }

  ngOnInit() {

  }
}
