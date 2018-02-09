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
} from '../model/data.model';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.less']
})

export class InsightComponent implements OnInit, OnChanges {
  @Input() companions: Array < ComponentInformationModel > ;
  @Output() companionAdded = new EventEmitter < ComponentInformationModel > ();

  public hasIssue = false;
  public responseReady = false;

  constructor() {}

  ngOnChanges() {
    console.log(this.companions);
    if (this.companions) {
      this.responseReady = true;
    }
  }

  ngOnInit() {}

  public companionWasAdded(dependency: ComponentInformationModel) {
    this.companionAdded.emit(dependency);
  }

}