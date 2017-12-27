import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {DependencyModule} from './dependency-editor/dependency-editor.module';


import { FormsModule } from '@angular/forms';

// import { UsersService } from './user/users.service';
// import { ThreadsService } from './thread/threads.service';
// import { MessagesService } from './message/messages.service';

// import { ChatMessageComponent } from './chat-message/chat-message.component';
// import { ChatWindowComponent } from './chat-window/chat-window.component';
// import { FromNowPipe } from './pipes/from-now.pipe';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    DependencyModule,
    HttpModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
