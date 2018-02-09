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
import { ComponentInformationModel, StackReportModel } from '../model/data.model';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { DependencySnapshot } from '../utils/dependency-snapshot';

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.less']
})

export class ListElementComponent implements OnInit {
  @Input() companion: ComponentInformationModel;
  @Output() companionAdded = new EventEmitter<ComponentInformationModel> ();

  constructor(private service: DependencyEditorService) {
  }

  ngOnInit() {
  }

  addDependency() {
    this.companionAdded.emit(this.companion);
  }
}
