import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../user/user.model';
import { UsersService } from '../user/users.service';
import { Thread } from '../thread/thread.model';
import { ThreadsService } from '../thread/threads.service';
import { Message } from '../message/message.model';
import { MessagesService } from '../message/messages.service';

@Component({
  selector: 'chat-window',
  styleUrls: ['./chat-window.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-window.component.html'
})
export class ChatWindowComponent implements OnInit {
  messages: Observable<any>;
  currentThread: Thread;
  draftMessage: Message;
  currentUser: User;
  public isOpen = false;
  public ecosystem = 'maven';
  @Input('mygui') appName: string;
  public securityPackages: Array<any> = [];
  @Input('dependencies') dependencies;

  @Output('addDep') dependencyAdded = new EventEmitter<any>();

  constructor(
    public messagesService: MessagesService,
    public threadsService: ThreadsService,
    public UsersService: UsersService,
    public el: ElementRef
  ) {}

  ngOnInit(): void {
    this.messages = this.threadsService.currentThreadMessages;

    this.draftMessage = new Message();

    this.threadsService.currentThread.subscribe((thread: Thread) => {
      this.currentThread = thread;
    });

    this.UsersService.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });

    this.messages.subscribe((messages: Array<Message>) => {
      setTimeout(() => {
        this.scrollToBottom();
      });
    });
  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }
  public toggleChatBox() {
    this.isOpen ? (this.isOpen = false) : (this.isOpen = true);
  }
  sendMessage(): void {
    if(this.draftMessage.text.toLowerCase().indexOf('switch') !== -1){
      this.dependencyAdded.emit(true);
    }
    const m: Message = this.draftMessage;
    m.author = this.currentUser;
    m.thread = this.currentThread;
    m.isRead = true;

    this.messagesService.addMessage(m);
    this.draftMessage = new Message();
  }

  scrollToBottom(): void {
    const scrollPane: any = this.el.nativeElement.querySelector(
      '.msg-container-base'
    );
    if (scrollPane) {
      scrollPane.scrollTop = scrollPane.scrollHeight;
    }
  }
  ngOnChanges(): void {
    if (this.appName) {
      if (this.appName.toLocaleLowerCase().indexOf('node') !== -1) {
        this.ecosystem = 'node';
      } else {
        this.ecosystem = 'maven';
      }
    }
    if ((this.ecosystem === 'node')) {
      this.securityPackages = ['B'];
    } else {
      this.securityPackages = ['com.googlecode.xmemcached'];
    }
    if (this.dependencies) {
      if (this.dependencies) {
        this.dependencies['dependencies'].forEach(d => {
          if (this.securityPackages.indexOf(d.name) !== -1) {
            this.isOpen = true;
          }
        });
      }
    }
  }
}
