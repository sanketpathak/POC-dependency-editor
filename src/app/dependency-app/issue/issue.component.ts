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

@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.less']
})

export class IssueComponent implements OnInit, OnChanges {
  @Input() issueName: string;
  @Input() issueSymbol: string;
  @Input() issueStatus: string | number;
  @Input() hasIssue: boolean;

  public isLoading = false;

  constructor() {}

  ngOnChanges() {
    if (this.issueStatus === null) {
      this.isLoading = true;
    } else if (typeof this.issueStatus === 'string' && this.issueStatus) {
      this.isLoading = false;
    } else if (typeof this.issueStatus === 'number') {
      this.isLoading = false;
    }
  }

  ngOnInit() {

  }
}