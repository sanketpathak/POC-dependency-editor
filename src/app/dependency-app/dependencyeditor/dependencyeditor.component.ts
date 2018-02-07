import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'dependency-editor',
  templateUrl: './dependencyeditor.component.html',
  styleUrls: ['./dependencyeditor.component.less']
})

export class DependencyEditorComponent implements OnInit {
  
  public component: string[]  ;

  constructor() { }

  ngOnInit() {
    this.component = ['Hystrix', 'Hystrix01', 'Comp with big name 01', 'Comp with big name 02'];
  }

}
