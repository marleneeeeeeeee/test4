import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {IncomingMessage, StateService} from '../services/state-service';

@Component({
  selector: 'app-notification-bubble',
  imports: [],
  templateUrl: './notification-bubble.html',
  styleUrl: './notification-bubble.css',
})
export class NotificationBubble implements OnInit, OnDestroy {
  visible = signal(false);
  currentMessage = signal<IncomingMessage | null>(null);
  private sub: Subscription | null = null;
  private hideTimer: any = null;

  constructor(private stateService: StateService, private router: Router) {}

  ngOnInit() {
    this.sub = this.stateService.newMessages$.subscribe(msg => {
      if (this.stateService.activeConversationsUserId() === msg.sender_id) {
        return;
      }
      this.showBubble(msg);
    });
  }

  showBubble(msg: IncomingMessage) {
    this.currentMessage.set(msg);
    this.visible.set(true);
    if (this.hideTimer) clearTimeout(this.hideTimer);
    this.hideTimer = setTimeout(() => this.visible.set(false), 6000);
  }

  openChat() {
    const msg = this.currentMessage();
    if (!msg) return;
    this.stateService.pendingOpenUserId.set(msg.sender_id);
    this.router.navigate(['/messages']);
    this.visible.set(false);
  }

  close() {
    this.visible.set(false);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
