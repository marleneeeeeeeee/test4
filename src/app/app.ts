import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationBubble } from './notification-bubble/notification-bubble';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationBubble],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('messenger-frontend');
}
