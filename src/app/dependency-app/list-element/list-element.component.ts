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

  public showAlternateSection = true;

  constructor(private service: DependencyEditorService) {
  }

  ngOnInit() {
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
  }

  ignoreAlternate() {
    this.showAlternateSection = false;
  }
}
