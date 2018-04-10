import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Broadcaster } from 'ngx-base';
import { AnalyticsUrlService } from './shared/analytics-url.service';
import { AppComponent } from './app.component';
import { DependencyEditorModule } from './dependency-editor/dependency-editor.module';
import { MockAuthenticationService } from './shared/mock-auth-service';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';
import { DependencyEditorTokenProvider } from './shared/depeditor-tokenprovider';
import { URLProvider } from './shared/url-provider';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    DependencyEditorModule
  ],
  providers: [
    Broadcaster,
    ApiLocatorService,
    witApiUrlProvider,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
    { provide: URLProvider, useClass: AnalyticsUrlService },
    { provide: DependencyEditorTokenProvider, useClass: MockAuthenticationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
