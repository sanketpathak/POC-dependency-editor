import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.less']
})

export class SecurityComponent implements OnInit {
  
  public issue_name: string;
  public issue_symbol: string;
  public issue_status: string;

  constructor() { }

  ngOnInit() {}

}
