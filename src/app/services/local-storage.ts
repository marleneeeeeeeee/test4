import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {

  saveCredentials (username: string, password: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }

  loadCredentials () : {username : string, password: string}|null{
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (username && password) {
      return {username, password};
    }
    return null;
  }

  clearCredentials () {
    localStorage.clear();
  }

  addKnownContact (userId : string) {
    const known = this.getKnownContactIds();
    if(known.includes(userId)) {
      return;
    }
    known.push(userId);
    localStorage.setItem('knownContacts', JSON.stringify(known));
  }

  getKnownContactIds (): string[] {
    const contacts = localStorage.getItem('knownContacts');
    if (!contacts) {
      return [];
    }
    return JSON.parse(contacts);
  }
}
