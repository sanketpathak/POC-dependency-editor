import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.less']
})

export class ListElementComponent implements OnInit {
  @Input() package : string;
  @Input() version : string;
  @Input() security_issue : string;
  @Input() license_issue : string;

  constructor() { }

  ngOnInit() {}

}
