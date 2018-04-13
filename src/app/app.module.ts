import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AnalyticsUrlService } from './shared/analytics-url.service';
import { AppComponent } from './app.component';
import { DependencyEditorModule } from './dependency-editor/dependency-editor.module';
import { MockAuthenticationService } from './shared/mock-auth-service';
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
    { provide: URLProvider, useClass: AnalyticsUrlService },
    { provide: DependencyEditorTokenProvider, useClass: MockAuthenticationService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
