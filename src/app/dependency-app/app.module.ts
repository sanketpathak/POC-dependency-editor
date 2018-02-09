import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AuthenticationService } from 'ngx-login-client';

import { AppComponent } from './app.component';
import { DependencyEditorModule } from './dependency-editor/dependency-editor.module';
import { MockAuthenticationService } from './shared/mock-auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DependencyEditorModule
  ],
  providers: [
    {
      provide: AuthenticationService, useClass: MockAuthenticationService
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
