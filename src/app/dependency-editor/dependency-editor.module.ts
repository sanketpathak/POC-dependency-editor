import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Broadcaster } from 'ngx-base';
import { DependencyEditorTokenProvider } from '../shared/depeditor-tokenprovider';
import { ModalModule } from 'ngx-modal';
import { AuthenticationService } from 'ngx-login-client';
import { witApiUrlProvider } from '../shared/wit-api.provider';
import { ApiLocatorService } from '../shared/api-locator.service';
import { authApiUrlProvider } from '../shared/auth-api.provider';
import { ssoApiUrlProvider } from '../shared/sso-api.provider';
import { realmProvider } from '../shared/realm-token.provider';

import { DependencyEditorComponent } from './dependency-editor.component';
import { InsightModule } from '../insights/insights.module';
import { AddDependencyModule } from '../add-dependency/add-dependency.module';
import { SecurityModule } from '../security/security.module';
import { LicenseModule } from '../license/license.module';
import { CurrentprojectModule } from '../current-project/current-project.module';
import { DependencyEditorService } from '../shared/dependency-editor.service';
import { URLProvider } from '../shared/url-provider';

@NgModule({
 imports: [
    CommonModule,
    AccordionModule.forRoot(),
    HttpModule,
    FormsModule,
    ModalModule,
    InsightModule,
    AddDependencyModule,
    SecurityModule,
    LicenseModule,
    CurrentprojectModule
],
 declarations: [
    DependencyEditorComponent
],
 exports: [
    DependencyEditorComponent
],
 providers: [
    URLProvider,
    DependencyEditorTokenProvider,
    DependencyEditorService
 ]
})
export class DependencyEditorModule {}
