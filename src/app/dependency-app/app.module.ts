import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DependencyEditorModule } from './dependencyeditor/dependencyeditor.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DependencyEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
