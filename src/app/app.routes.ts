import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro';
import { LoginComponent } from './auth/login/login';
import { MessageListComponent } from './message/message-list/message-list';
import { authGuard} from './auth/auth-guard'

export const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'messages', component: MessageListComponent, canActivate: [authGuard] }
];
