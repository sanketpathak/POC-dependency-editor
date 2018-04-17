import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';

import { FilterPipe } from './add-dependency.pipe';
import { AddDependencyComponent } from './add-dependency.component';
import { ListElementModule } from '../list-element/list-element.module';
import { URLProvider } from '../shared/url-provider';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { ErrorMessageHandler } from '../shared/error-message-handler';


@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    ModalModule,
    ListElementModule
],
 declarations: [
    AddDependencyComponent, FilterPipe
],
 exports: [
    AddDependencyComponent
],
 providers: [
    URLProvider,
    DependencyEditorTokenProvider,
    DependencyEditorService,
    ErrorMessageHandler
 ]
})
export class AddDependencyModule {}
