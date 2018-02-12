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

  constructor() {}

  ngOnInit() {}
  public get_secure() {
    this.secureIssue = true;
  }
}
