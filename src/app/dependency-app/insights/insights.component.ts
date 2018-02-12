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
import * as _ from 'lodash';

import {
  ComponentInformationModel
} from '../model/data.model';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.less']
})

export class InsightComponent implements OnInit, OnChanges {
  @Input() companions: Array < ComponentInformationModel > ;
  @Output() companionAdded = new EventEmitter < any > ();

  public hasIssue = false;
  public responseReady = false;

  constructor() {}

  ngOnChanges() {
    if (this.companions) {
      this.responseReady = true;
    }
  }

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
