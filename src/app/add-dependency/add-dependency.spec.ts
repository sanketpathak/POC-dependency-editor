import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDependencyComponent } from './add-dependency.component';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { ListElementModule } from '../list-element/list-element.module';
import { FilterPipe } from './add-dependency.pipe';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { URLProvider } from '../shared/url-provider';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';

describe('CurrentprojectComponent', () => {
  let component: AddDependencyComponent;
  let fixture: ComponentFixture<AddDependencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        AccordionModule.forRoot(),
        HttpModule,
        FormsModule,
        ModalModule,
        ListElementModule
    ],
     declarations: [
        AddDependencyComponent,
        FilterPipe
    ],
     providers: [
      URLProvider,
      DependencyEditorTokenProvider,
      DependencyEditorService
     ]
     }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
