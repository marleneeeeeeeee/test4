import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBubble } from './notification-bubble';

describe('NotificationBubble', () => {
  let component: NotificationBubble;
  let fixture: ComponentFixture<NotificationBubble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationBubble],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationBubble);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
