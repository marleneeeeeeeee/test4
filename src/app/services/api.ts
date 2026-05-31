import { Injectable, signal } from '@angular/core';
import {User, Message} from '../message/IMessage';
import {WebSocketService} from './web-socket';
import {StateService} from './state-service';


export interface ApiResponse {
  success?: boolean;
  error?: string;
  token?: string;
  id?: string;
}

const BASE_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger";
@Injectable({
  providedIn: 'root',
})

export class ApiService {

  constructor(private webSocketService: WebSocketService,
              private stateService: StateService
  ) { }
  readonly username = signal<string>('');
  readonly isLoggedIn = signal<boolean>(false);

  private token: string | null = null;
  private userId: string | null = null;
  private cachedUsers: User[] = [];
  private wsSub: any = null;

  getUserId(): string|null {
    return this.userId;
  }

  async loginUser(usernameOrEmail: string, password: string): Promise<ApiResponse> {
    try {
      const body = new URLSearchParams({
        username_or_email: usernameOrEmail,
        password,
      });
      const response = await fetch(`${BASE_URL}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      const data: ApiResponse = await response.json();
      if (!data.token || !data.id) {
        return { success: false, error: "User or password not found" };
      }
      this.token = data.token;
      this.userId = data.id;
      this.isLoggedIn.set(true);
      this.username.set(usernameOrEmail);
      data.success = true;

      this.webSocketService.connect(this.userId, this.token);
      this.wsSub = this.webSocketService.newMessages$.subscribe(
        message => {
          const sender = this.cachedUsers.find(u => u.id === message.sender_id);
          this.stateService.notifyNewMessage({
              sender_id: message.sender_id,
              receiver_id: message.receiver_id,
              timestamp: message.timestamp,
              senderName: sender?.name,
              message: message.message,
            });
        });
      return data;

    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: 'Login fehlgeschlagen' };
    }
  }

  async getUsers(): Promise<User[] | { error?: string }> {
    if (!this.userId || !this.token) {
      return { error: "No token or userId" };
    }
    try {
      const params = new URLSearchParams({
        token: this.token,
        id: this.userId
      });
      const response = await fetch(`${BASE_URL}/get_users.php?${params}`, {
        method: "GET",
      });
      const data: User[] = await response.json();
      this.cachedUsers = data;
      return data;
    } catch (err) {
      return { error: "Error getting users: " + err };
    }
  }

  async getConversation(user2Id: string): Promise<Message[] | { error?: string }> {
    if (!this.token || !this.userId) return { error: "Not authenticated" };
    try {
      const params = new URLSearchParams({
        token: this.token,
        user1_id: this.userId,
        user2_id: user2Id,
      });
      const response = await fetch(`${BASE_URL}/get_conversation.php?${params}`);
      return await response.json();
    } catch (err) {
      console.error("Loading conversation error:", err);
      return { error: "Error getting conversation: " + err };
    }
  }

  logout (): void {
    this.username.set('');
    this.isLoggedIn.set(false);
    this.token = null;
    this.userId = null;
    this.cachedUsers = [];
    this.wsSub?.unsubscribe();
    this.wsSub = null;
    this.webSocketService.disconnect();
  }

  async sendMessage(receiverId: string, message: string): Promise<ApiResponse> {
    try {
      const response = await fetch(
        'http://webp-ilv-backend.cs.technikum-wien.at:3000/send-message',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender_id: this.userId,
            receiver_id: receiverId,
            message: message,
            token: this.token
          })
        }
      );
      const data = await response.json();
      if (data.error) return { success: false, error: data.error };
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Network error' };
    }
  }
}
