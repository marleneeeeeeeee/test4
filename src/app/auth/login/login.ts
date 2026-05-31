import { Component, OnInit, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import {ApiResponse, ApiService} from '../../services/api';
import {LocalStorage} from '../../services/local-storage';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [ FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class LoginComponent implements OnInit {
  username= '';
  password = '';
  error = signal('');
  remember= false;
  private apiService = inject(ApiService);
  private localStorage = inject(LocalStorage);
  private router = inject(Router);


  async ngOnInit() {
    const saved = this.localStorage.loadCredentials();
    if(!saved) {
      return;
    }
    this.username = saved.username;
    this.password = saved.password;
    this.remember = true;
    await this.onLogin();
  }

  async onLogin() {
    const result : ApiResponse = await this.apiService.loginUser(this.username, this.password);
    if(!result.success) {
      this.error.set(result.error ?? 'Unable to login');
      return;
    }
    if(this.remember){
      this.localStorage.saveCredentials(this.username, this.password);
    }
    else{
      this.localStorage.clearCredentials();
    }
    this.router.navigate(['/messages']);
  }
}
