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
import { ComponentInformationModel, StackReportModel } from '../model/stack-response.model';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { DependencySnapshot } from '../utils/dependency-snapshot';

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrls: ['./list-element.component.less']
})

export class ListElementComponent implements OnInit {
  @Input() companion: ComponentInformationModel;
  private addDependencyUrl: string;

  constructor(private service: DependencyEditorService) {
  }

  ngOnInit() {
    this.addDependencyUrl = 'https://recommender.api.prod-preview.openshift.io/api/v1/depeditor-analyses/';
  }

  addDependency() {
    const persist = false;
    const urlToHit = this.addDependencyUrl + 'persist=' + persist;
    const payload = {};
    payload['_resolved'] = DependencySnapshot.DEP_SNAPSHOT;
    payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
    payload['request_id'] = DependencySnapshot.REQUEST_ID;
    console.log(payload);
    this.service.addDependency(this.addDependencyUrl, payload)
    .subscribe((response: StackReportModel) => {
      console.log('response after add dependency call', response);
    });
  }
}
