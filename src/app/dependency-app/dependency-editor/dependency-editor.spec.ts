import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyEditorComponent } from './dependency-editor.component';

describe('CurrentprojectComponent', () => {
  let component: DependencyEditorComponent;
  let fixture: ComponentFixture<DependencyEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DependencyEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
