import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

import { DependencyEditorService } from '../shared/dependency-editor.service';
import { StackReportModel, DependencySnapshotItem } from '../model/stack-response.model';
import { DependencySnapshot } from '../utils/dependency-snapshot';

@Component({
  selector: 'app-dependency-editor',
  templateUrl: './dependencyeditor.component.html',
  styleUrls: ['./dependencyeditor.component.less']
})
export class DependencyEditorComponent implements OnInit {
  public dependencies: Array<DependencySnapshotItem>  ;

  constructor(private service: DependencyEditorService) { 
    this.service = service;
  }

  ngOnInit() {
    const stackUrl = 'https://recommender.api.openshift.io/api/v1/stack-analyses/66ecaa97429a48fd90663d1c9bfe05b0';
    this.service.getStackAnalyses(stackUrl)
    .subscribe((response: StackReportModel) => {
      console.log('stack response', response);
      DependencySnapshot.ECOSYSTEM = response.result[0].user_stack_info.ecosystem;
      this.dependencies = DependencySnapshot.DEP_SNAPSHOT = response.result[0].user_stack_info.dependencies;
    });
  }

}
