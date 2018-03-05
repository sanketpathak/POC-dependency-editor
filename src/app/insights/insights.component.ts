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
  FormsModule
} from '@angular/forms';
import {
  AccordionModule
} from 'ngx-bootstrap';
import * as _ from 'lodash';

import {
  ComponentInformationModel
} from '../model/data.model';

@Component({
  selector: 'app-insights',
  styleUrls: ['./insights.component.less'],
  templateUrl: './insights.component.html'
})

export class InsightComponent implements OnInit, OnChanges {
  @Input() companions: Array < ComponentInformationModel > ;
  @Input() alternate: Array < ComponentInformationModel > ;
  @Output() companionAdded = new EventEmitter < any > ();

  public hasIssue = false;

  constructor() {}

  ngOnChanges() {}

  ngOnInit() {}

  public companionWasAdded(eventData: any) {
    this.companionAdded.emit(eventData);
  }

  public removeCompanion(dependency: ComponentInformationModel) {
    _.remove(this.companions, (companion) => {
      return companion.name === dependency.name;
    });
  }
}
