import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'currentproject',
  templateUrl: './currentproject.component.html',
  styleUrls: ['./currentproject.component.less']
})

export class CurrentprojectComponent implements OnInit {
  
  public component: string[]  ;

  constructor() { }

  ngOnInit() {
    this.component = ['Hystrix', 'Hystrix01', 'Comp with big name 01', 'Comp with big name 02'];
  }

}
