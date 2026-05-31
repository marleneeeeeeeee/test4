import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface WebSocketMessage {
  event: string;
  sender_id: string;
  receiver_id: string;
  timestamp: number;
  message: string;
}
@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket: WebSocket | null = null;
  private messageSubject: Subject<WebSocketMessage> = new Subject<WebSocketMessage>();
  public newMessages$ = this.messageSubject.asObservable();

  connect (userId: string, token :string):void{
    const url = `ws://webp-ilv-backend.cs.technikum-wien.at:3000/?user_id=${userId}&token=${token}`;
    try {
      this.socket = new WebSocket(url);
      this.socket.onopen = ():void => console.log('WebSocket Connected!');
      this.socket.onmessage = (event):void  => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          if (data.event === 'message') {
            this.messageSubject.next(data);
          }
        } catch (error) {
          console.log("Websocket message error:", error);
        }
      }
      this.socket.onerror = (error):void => {
        console.error('WebSocket error:', error);
        setTimeout(() => this.connect(userId, token), 5000);
      };
      this.socket.onclose = ():void => console.log('WebSocket disconnected');
    }
    catch (error) {
      console.error('WebSocket error:', error);
    }
  }

  disconnect() :void{
    if(this.socket){
      this.socket.close();
      this.socket = null;
    }
  }
}
