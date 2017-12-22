import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { PackagesModule } from './packages/packages.component.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // BrowserModule,
    HttpModule,
    PackagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
