import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PackagesModule} from '../packages/packages.component.module';
import {ApplicationModule} from '../application/application.module';


import { FormsModule } from '@angular/forms';

import { DependencyComponent } from './dependency-editor.component';
import { PackagesComponent } from '../packages/packages.component';

import { UsersService } from '../user/users.service';
import { ThreadsService } from '../thread/threads.service';
import { MessagesService } from '../message/messages.service';

import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { ChatWindowComponent } from '../chat-window/chat-window.component';
import { FromNowPipe } from '../pipes/from-now.pipe';

@NgModule ({
    imports: [
        CommonModule,
        PackagesModule,
        ApplicationModule,
        FormsModule
    ],
    declarations: [
        DependencyComponent,
        ChatMessageComponent,
        ChatWindowComponent,
        FromNowPipe
    ],
    providers: [MessagesService, ThreadsService, UsersService],
    exports: [
        DependencyComponent,
        PackagesModule,
        ApplicationModule
    ]
})

export class DependencyModule {}
