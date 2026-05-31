import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Message} from './IMessage';
import {inject} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = '/api/';
  private http = inject(HttpClient);

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }
}
