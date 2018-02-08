import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { BrowserModule } from '@angular/platform-browser';

import { DependencyEditorComponent } from './dependencyeditor.component';
import { InsightModule } from '../insights/insights.module'
import { AddDependencyModule } from '../add-dependency/add-dependency.module'
import { SecurityModule } from '../issue/security/security.module'
import { LicenseModule } from '../issue/license/license.module'
import { CurrentprojectModule } from '../currentproject/currentproject.module';
import { DependencyEditorService } from '../shared/dependency-editor.service';

@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    TagInputModule,
    BrowserModule,
    InsightModule,
    AddDependencyModule,
    SecurityModule,
    LicenseModule,
    CurrentprojectModule
],
 declarations: [
    DependencyEditorComponent,
],
 exports: [
    DependencyEditorComponent,
],
 providers: [
     DependencyEditorService
 ],
})
export class DependencyEditorModule {}