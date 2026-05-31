import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Message} from './IMessage';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = '/api/';

  constructor(private http: HttpClient) { }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  sendMessage(message: Message): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }
}
