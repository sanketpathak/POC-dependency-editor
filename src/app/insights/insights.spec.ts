import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightComponent } from './insights.component';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ListElementModule } from '../list-element/list-element.module';

describe('InsightComponent', () => {
  let component: InsightComponent;
  let fixture: ComponentFixture<InsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
          CommonModule,
          AccordionModule.forRoot(),
          HttpModule,
          FormsModule,
          ListElementModule
      ],
      declarations: [
          InsightComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
