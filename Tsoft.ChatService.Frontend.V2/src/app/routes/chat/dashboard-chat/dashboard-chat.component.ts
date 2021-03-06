import { selectAllMessages } from './../store/message/message.selector';
import { allUsersRequestedAction } from './../store/user/user.action';
import { selectAllUsers, selectAllUsersLoading } from './../store/user/user.selector';
import { selectAllConversations, selectAllConversationsLoading, selectSelectedConversation } from './../store/conversation/conversation.selector';
import { allConversationsRequestedAction, updateConversationSuccessAction } from './../store/conversation/conversation.action';

import { Message } from './../models/message';
import { UserStatus } from './../models/user';
import { BehaviorSubject } from 'rxjs';
import { ChatHubService } from './../service/chat-hub.service';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit, ChangeDetectorRef, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { environment } from '@env/environment';
import * as signalR from "@aspnet/signalr";
import { select, Store } from '@ngrx/store';
import { receiveMessageSuccessAction } from '../store/message/message.actions';
import { selectAll } from '../store/message/message.reducer';

@Component({
  selector: 'app-dashboard-chat',
  templateUrl: './dashboard-chat.component.html',
  styleUrls: ['./dashboard-chat.component.less']
})
export class DashboardChatComponent implements OnInit {

  selectedConversation$ = this.store.select(selectSelectedConversation);

  // users$ = this.store.select(selectAllUsers);
  conversationLoading$ = this.store.select(selectAllConversationsLoading);
  userLoading$ = this.store.select(selectAllUsersLoading);

  messages$ = this.store.select(selectAllMessages);

  conversations$ = this.store.select(selectAllConversations);
  user$ = this.store.select(selectAllUsers);

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (this.chatHubService.isConnectionIsEstablished()) {
      if (document.hidden) {
        this.chatHubService.sendStatus(UserStatus.BUSY);
      } else {
        this.chatHubService.sendStatus(UserStatus.ONLINE);
      }
    }
  }

  constructor(
    private store: Store, //TODO: Thiếu app state
    private chatHubService: ChatHubService
  ) { }
  ngOnInit() {
    this.chatHubService.startedEvent$.subscribe(async response => {
      if (response) {
        this.store.dispatch(allConversationsRequestedAction());
        this.store.dispatch(allUsersRequestedAction());
        // await this.fetchAllConversations();
        // await this.fetchRoomsAndUser();
      }
    })

    // this.chatHubService.addUserEvent$.subscribe(data => {
    //   if (data && this.users) {
    //     this.users = [...this.users, data];
    //     // this.users$.next(this.users);
    //   }
    // })

    // this.chatHubService.userOnlineEvent$.subscribe(data => {
    //   if (data && this.users) {
    //     let index = this.users.findIndex(x => x.id == data.id);
    //     this.users[index] = data;
    //     const users = [...this.users];
    //     // this.users$.next(this.users);
    //     this.store.dispatch(loadUsersSuccessAction({ users }));
    //   }
    // })

    // this.chatHubService.userOfflineEvent$.subscribe(data => {
    //   if (data && this.users) {
    //     let index = this.users.findIndex(x => x.id == data.id);
    //     this.users[index] = data;
    //     let users = [...this.users];
    //     // this.users$.next(this.users);
    //     this.store.dispatch(loadUsersSuccessAction({ users }));
    //   }
    // })
    // this.chatHubService.userBusyEvent$.subscribe(data => {
    //   if (data && this.users) {
    //     let index = this.users.findIndex(x => x.id == data.id);
    //     this.users[index] = data;
    //     this.users = [...this.users];
    //     // this.users$.next(this.users);
    //     let users = [...this.users];

    //     this.store.dispatch(loadUsersSuccessAction({ users }));
    //   }
    // })
    this.chatHubService.newMessageEvent$.subscribe(data => {
      console.log('newMessage', data)
      if (data) {
        this.store.dispatch(receiveMessageSuccessAction({ message: data.message }));
        this.store.dispatch(updateConversationSuccessAction({ conversation: data.conversation }));
      }
    })
  }

  // async fetchRoomsAndUser() {
  //   this.store.dispatch(loadUsersAction());
  //   let users = await this.chatHubService.getAllUsers();
  //   this.users = [...users];
  //   this.store.dispatch(loadUsersSuccessAction({ users }));
  //   this.chatHubService.sendStatus(UserStatus.ONLINE);
  //   // this.rooms$.next(this.rooms);
  // }

  // async fetchAllConversations() {
  //   let conversations = await this.chatHubService.getAllConversations();
  //   this.store.dispatch(loadConversationSuccessAction({ conversations }));
  // }
}
