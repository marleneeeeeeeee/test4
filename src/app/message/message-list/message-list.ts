import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message, User } from '../IMessage';
import { ApiService} from '../../services/api';
import {LocalStorage} from '../../services/local-storage';
import {StateService} from '../../services/state-service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-message-list',
  imports: [FormsModule],
  templateUrl: './message-list.html',
  styleUrl: './message-list.css',
})
export class MessageListComponent implements OnInit, OnDestroy {
  readonly messages= signal<Message[]|null>([]);
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly selectedUser = signal<User | null>(null);
  readonly contacts = signal<User[]|null|undefined>([]);
  readonly knownContacts = signal<User[]|null|undefined>([]);
  readonly otherContacts = signal<User[]|null|undefined>([]);
  newMessage = '';
  private sub: Subscription|null = null;

  constructor(public api: ApiService, private localStorage: LocalStorage, private stateService: StateService) {
    effect(() => {
      const pendingId = this.stateService.pendingOpenUserId();
      if (!pendingId) return;
      const all = this.contacts();
      if (!all) return;
      const userToOpen = all.find(u => u.id === pendingId);
      if (userToOpen) {
        this.loadConversation(userToOpen);
        this.stateService.pendingOpenUserId.set(null);
      }
    });
  }

  async ngOnInit() {
    this.isLoading.set(true);
    await this.api.getUsers().then(
      result =>
      {if (Array.isArray(result)) {
        const knownIds = this.localStorage.getKnownContactIds();
        const all = result as User[];
        this.knownContacts.set(all.filter(u => knownIds.includes(u.id)));
        this.otherContacts.set(all.filter(u => !knownIds.includes(u.id)));
        this.contacts.set(result);

        const pendingId = this.stateService.pendingOpenUserId();
        if (pendingId) {
          const userToOpen = all.find(u => u.id === pendingId);
          if (userToOpen) this.loadConversation(userToOpen);
            this.stateService.pendingOpenUserId.set(null);
          }
        }
        this.sub = this.stateService.newMessages$.subscribe(message => {
          const current = this.selectedUser();
          if (current && (current.id === message.sender_id|| message.receiver_id === current.id)) {
            this.loadConversation(current);
          }
        })
      });
    this.isLoading.set(false);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  async loadConversation(user : User) {
    this.localStorage.addKnownContact(user.id);
    this.stateService.activeConversationsUserId.set(user.id);
    this.isLoading.set(true);
    this.selectedUser.set(user);
    await this.api.getConversation(user.id)
      .then(data =>
        {if(Array.isArray(data)) {this.messages.set(data) }})
      .catch((err) => this.errorMessage.set("Error:" +err))
      .finally(() => this.isLoading.set(false));
    this.scrollToBottom();
  }

  async sendMessage(){
    const user = this.selectedUser();
    if(!user || !this.newMessage.trim()){
      return;
    }
    const result = await this.api.sendMessage(user.id, this.newMessage.trim());
    if (result.success) {
      this.newMessage = '';
      await this.loadConversation(user);
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.getElementById('messageContainer');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }
}
