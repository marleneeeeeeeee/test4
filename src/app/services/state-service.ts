import { Injectable, signal } from '@angular/core';
import {Subject} from 'rxjs';

export interface IncomingMessage {
  sender_id: string;
  receiver_id: string;
  timestamp: number;
  message?: string;
  senderName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private newMessageSubject: Subject<IncomingMessage> = new Subject<IncomingMessage>();

  public newMessages$ = this.newMessageSubject.asObservable();
  activeConversationsUserId = signal<string|null>(null);
  pendingOpenUserId = signal<string|null>(null);
  notifyNewMessage(message: IncomingMessage) :void{
    this.newMessageSubject.next(message);
  }
}
