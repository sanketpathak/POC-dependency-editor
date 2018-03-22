import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { ModalModule } from 'ngx-modal';
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
// import { PackagesModule } from '../packages/packages.component.module';
import { DependencyEditorService } from '../shared/dependency-editor.service';

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
    // PackagesModule
],
 declarations: [
    DependencyEditorComponent
],
 exports: [
    DependencyEditorComponent
],
 providers: [
    AuthenticationService,
    Broadcaster,
    ApiLocatorService,
    witApiUrlProvider,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
    DependencyEditorService
 ]
})
export class DependencyEditorModule {}
