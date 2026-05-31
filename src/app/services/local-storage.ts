import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {

  saveCredentials (username: string, password: string):void {
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

  clearCredentials ():void {
    localStorage.clear();
  }

  addKnownContact (userId : string) :void{
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
