import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  sessionStorage: Storage;

  prefix = 'unicontr_';

  constructor() {
    this.sessionStorage = window.sessionStorage; 
  }

  getPrefix() {
    return this.prefix;
  }

  getKey(key: string) {
    return this.prefix + key;
  }

  getItem(key: string) {
    if (this.isSessionStorageSupported) {
      const item = this.sessionStorage.getItem(this.getKey(key));
      return (item) ? JSON.parse(item) : null;  
    }
    return null;
  }

  setItem(key: string, value: any): void {
    if (this.isSessionStorageSupported) {
      this.sessionStorage.setItem(this.getKey(key), JSON.stringify(value));
    }    
  }

  removeItem(key: string): void {
    if (this.isSessionStorageSupported) {
      this.sessionStorage.removeItem(this.getKey(key));
    }
  }

  clear() {
    if (this.isSessionStorageSupported) {
      this.sessionStorage.clear();
    }
  }

  get isSessionStorageSupported(): boolean {
    return !!this.sessionStorage
  }
}