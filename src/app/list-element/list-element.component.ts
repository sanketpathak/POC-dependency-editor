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

import { ComponentInformationModel, StackReportModel, EventDataModel } from '../model/data.model';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { DependencySnapshot } from '../utils/dependency-snapshot';

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.less']
})

export class ListElementComponent implements OnInit {
  @Input() dependency: ComponentInformationModel;
  @Input() fromAddDependency: string;
  @Output() companionAdded = new EventEmitter<EventDataModel> ();
  @Output() companionRemoved = new EventEmitter<ComponentInformationModel> ();

  public showAlternateSection = false;

  constructor(private service: DependencyEditorService) {
  }

  ngOnInit() {
    if (this.dependency && this.dependency.alternate) {
      this.showAlternateSection = true;
    }
  }

  addDependency() {
    const objToEmit: EventDataModel = {
      depFull: this.dependency,
      depSnapshot: null,
      action: 'add'
    };
    this.companionAdded.emit(objToEmit);
  }

  removeCompanion() {
    this.companionRemoved.emit(this.dependency);
  }

  removeDependency() {
    this.service.removeDependency(this.dependency);
  }

  useAlternate() {
    console.log('user alternate clicked');
    // replace the alternate with DependencySnapshot in dep_full_added and dep_added
    const alternate = this.dependency.alternate;
    const indexFull = _.findIndex(DependencySnapshot.DEP_FULL_ADDED, { name: alternate.name });
    const indexSnapshot = _.findIndex(DependencySnapshot.DEP_SNAPSHOT_ADDED, { name: alternate.name });
    DependencySnapshot.DEP_FULL_ADDED.splice(indexFull, 1, alternate.alternate);
    DependencySnapshot.DEP_SNAPSHOT_ADDED.splice(indexSnapshot, 1, {
      package: alternate.alternate.name,
      version: alternate.alternate.version
    });
    this.showAlternateSection = false;
  }

  ignoreAlternate() {
    this.showAlternateSection = false;
  }
}
