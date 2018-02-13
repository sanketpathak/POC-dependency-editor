import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';
import { DependencySnapshotItem } from '../model/data.model';

@Component({
  selector: 'app-current-project',
  templateUrl: './current-project.component.html',
  styleUrls: ['./current-project.component.less']
})

export class CurrentprojectComponent implements OnInit {
  @Input() dependencies: Array<DependencySnapshotItem>;
  @Input() metadata: any;

  public projectDependencies: string[]  ;
  public isOpen : boolean = false; 
  public upDown: string = "fa fa-angle-up";

  constructor() { }

  ngOnInit() {
    this.projectDependencies = ['Hystrix',  'Hystrix01', 'Comp with big name 01', 'Comp with big name 02'];
    debugger;
  }
}
