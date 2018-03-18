import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { AppComponent } from './app.component';
import { DependencyEditorModule } from './dependency-editor/dependency-editor.module';
import { MockAuthenticationService } from './shared/mock-auth.service';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { ApiLocatorService } from './shared/api-locator.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DependencyEditorModule
  ],
  providers: [
    Broadcaster,
    ApiLocatorService,
    witApiUrlProvider,
    authApiUrlProvider,
    ssoApiUrlProvider,
    realmProvider,
    {
      provide: AuthenticationService, useClass: MockAuthenticationService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
