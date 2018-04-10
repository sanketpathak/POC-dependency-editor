import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DependencyEditorModule } from './dependency-editor/dependency-editor.module';
import { Broadcaster } from 'ngx-base';
import { ApiLocatorService } from './shared/api-locator.service';
import { witApiUrlProvider } from './shared/wit-api.provider';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { realmProvider } from './shared/realm-token.provider';
import { URLProvider } from './shared/url-provider';
import { AnalyticsUrlService } from './shared/analytics-url.service';
import { DependencyEditorTokenProvider } from './shared/depeditor-tokenprovider';
import { MockAuthenticationService } from './shared/mock-auth-service';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  // it(`should have as title 'app'`, async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app');
  // }));
  // fit('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to app!');
  // }));
});
