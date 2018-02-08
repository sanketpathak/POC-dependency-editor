import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';
import { DependencySnapshotItem } from '../model/stack-response.model';

@Component({
  selector: 'app-current-project',
  templateUrl: './currentproject.component.html',
  styleUrls: ['./currentproject.component.less']
})

export class CurrentprojectComponent implements OnInit {
  @Input() dependencies: Array<DependencySnapshotItem>;
  @Input() metadata: any;

  public component: string[]  ;

  constructor() { }

  ngOnInit() {
  }
}
