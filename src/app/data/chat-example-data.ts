/* tslint:disable:max-line-length */
import { User } from '../user/user.model';
import { Thread } from '../thread/thread.model';
import { Message } from '../message/message.model';
import { MessagesService } from '../message/messages.service';
import { ThreadsService } from '../thread/threads.service';
import { UsersService } from '../user/users.service';
import * as moment from 'moment';

// the person using the app us Juliet
const me: User      = new User('Juliet', 'assets/images/avatars/female-avatar-1.png');
const ladycap: User = new User('Lady Capulet', 'assets/images/avatars/female-avatar-2.png');
const echo: User    = new User('Dependency Editor', 'assets/images/avatars/male-avatar-1.png');
const rev: User     = new User('Reverse Bot', 'assets/images/avatars/female-avatar-4.png');
const wait: User    = new User('Waiting Bot', 'assets/images/avatars/male-avatar-2.png');

const tLadycap: Thread = new Thread('tLadycap', ladycap.name, ladycap.avatarSrc);
const tEcho: Thread    = new Thread('tEcho', echo.name, echo.avatarSrc);
const tRev: Thread     = new Thread('tRev', rev.name, rev.avatarSrc);
const tWait: Thread    = new Thread('tWait', wait.name, wait.avatarSrc);

const initialMessages: Array<Message> = [
  new Message({
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: `you want suggestion for this component?`,
    thread: tEcho
  })
];

export class ChatExampleData {
  static init(messagesService: MessagesService,
              threadsService: ThreadsService,
              UsersService: UsersService): void {

    // TODO make `messages` hot
    messagesService.messages.subscribe(() => ({}));

    // set "Juliet" as the current user
    UsersService.setCurrentUser(me);

    // create the initial messages
    initialMessages.map( (message: Message) => messagesService.addMessage(message) );

    threadsService.setCurrentThread(tEcho);

    this.setupBots(messagesService);
  }

  static setupBots(messagesService: MessagesService): void {

    // echo bot
    messagesService.messagesForThreadUser(tEcho, echo)
      .forEach( (message: Message): void => {
        if(message.text == "hi"){
          messagesService.addMessage(
            new Message({
              author: echo,
              text: 'hello!!',
              thread: tEcho
            })
          );
        }else {
          messagesService.addMessage(
            new Message({
              author: echo,
              text: message.text,
              thread: tEcho
            })
          );
        }
      },
                null);


  }
}
