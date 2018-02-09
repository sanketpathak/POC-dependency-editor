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

import {
  ComponentInformationModel
} from '../model/stack-response.model';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.less']
})

export class InsightComponent implements OnInit, OnChanges {
  @Input() companions: Array < ComponentInformationModel > ;

  constructor() {}

  ngOnChanges() {
    console.log(this.companions);
  }

  ngOnInit() {}

}
