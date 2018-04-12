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
  ComponentInformationModel, EventDataModel, BoosterInfo
} from '../model/data.model';

@Component({
  selector: 'app-insights',
  styleUrls: ['./insights.component.less'],
  templateUrl: './insights.component.html'
})

export class InsightComponent implements OnInit, OnChanges {
  @Input() boosterInfo: BoosterInfo;
  @Input() companions: Array < ComponentInformationModel > ;
  @Input() alternate: Array < ComponentInformationModel > ;
  @Output() companionAdded = new EventEmitter < any > ();

  public hasIssue: boolean = false;
  public objToEmit: EventDataModel[] = [];
  public added: Array<any> = [];
  public noOfTags: number = 0;

  constructor() {}

  ngOnChanges() {}

  ngOnInit() {}

  public addTag(eventData: Array<any>) {
        for (let i = 0; i < this.companions.length + this.alternate.length; i++) {
          if (this.added.length > 0 && this.added[i] && this.added[i].name === eventData[0].name) {
             if (this.added[i].type === true && eventData[0].type === true) {
                continue;
              } else if (this.added[i].type === true && eventData[0].type === false) {
                  this.added[i].type = false;
                  this.noOfTags--;
                  i++;
                  break;
                } else {
                if (eventData[0].type === true) {
                  this.added[i].type = true;
                  this.noOfTags++;
                  break;
                } else if (eventData[0].type === false) {
                  this.added[i].type = false;
                  this.noOfTags--;
                  break;
                }
              }
          } else if (i === this.added.length) {
            this.added.push(eventData[0]);
            this.noOfTags++;
            break;
          }
        }
  }

  public companionWasAdded(eventData: any) {
    for (let i = 0; i < this.added.length; i++) {
      if (this.added[i].type === true) {
        this.objToEmit[i] = {
          depFull: this.added[i].name,
          depSnapshot: null,
          action: 'add'
        };
      }
    }
  }

  public releaseCompanion(eventData: any) {
    for (let i = 0; i < this.added.length; i++) {
      if (this.added[i].type !== true) {
        this.objToEmit[i] = {
          depFull: null,
          depSnapshot: null,
          action: ''
        };
      }
    }
  }

  public addCompanion() {
    for (let i = 0; i < this.added.length; i++) {
      if ( this.added[i].type === true) {
        this.companionAdded.emit(this.objToEmit[i]);
      }
    }
    this.noOfTags = 0;
    this.added = [];
    this.objToEmit = [];
  }

  public removeDependency(dependency: ComponentInformationModel) {
    for (let i = 0; i < this.added.length; i++) {
      this.objToEmit[i] = {
        depFull: dependency,
        depSnapshot: null,
        action: 'remove'
      };
    }
}

  public removeCompanion(dependency: ComponentInformationModel) {
    _.remove(this.companions, (companion) => {
      return companion.name === dependency.name;
    });
  }
}
