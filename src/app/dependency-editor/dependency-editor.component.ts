import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';


import { ChatExampleData } from '../data/chat-example-data';

import { UsersService } from '../user/users.service';
import { ThreadsService } from '../thread/threads.service';
import { MessagesService } from '../message/messages.service';

@Component({
    selector: 'dependency-editor',
    styleUrls: ['./dependency-editor.component.less'],
    templateUrl: './dependency-editor.component.html'
})
export class DependencyComponent implements OnInit{
    @Input('gui') gui: any;
    public selectedDependencies: any;
    public guiAppName: string;
    public subject: any;
    constructor(public messagesService: MessagesService,
              public threadsService: ThreadsService,
              public usersService: UsersService,
        ) {
        ChatExampleData.init(messagesService, threadsService, usersService);
    }

    public handlePackageSelection(event: any): void {
        if (!event.preventDefault) {
            this.selectedDependencies = event;
            console.log(this.selectedDependencies);
        }
    }

    ngOnInit(){
        this.guiAppName = this.gui;
        console.log(this.subject);
    }

    onDependencyAdd(depAdded: any){
        debugger;
        console.log("event emiited"+ depAdded);
    }
}
