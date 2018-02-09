import {  Component,  OnInit,  OnChanges,  Input,  Output,  EventEmitter,  ViewEncapsulation } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-add-dependency',
  templateUrl: './add-dependency.component.html',
  styleUrls: ['./add-dependency.component.less']
})

export class AddDependencyComponent implements OnInit {
  public dependencySearchString: string;

  constructor() { }

  ngOnInit() {}

  getDependencies() {
    console.log('component search string', this.dependencySearchString);
  }

}
