import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { InfraMessage, InfraMessageType } from './message/message';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private keepAfterRouteChange = false;
  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            if (this.keepAfterRouteChange) {
                // only keep for a single route change
                this.keepAfterRouteChange = false;
            } else {
                // clear alert messages
                // this.clear();
            }
        }
    });
  }

  subject: Subject<InfraMessage[]> = new Subject();
  _messages: InfraMessage[] = [];

  get messages() {
    return this.subject.asObservable();
  }

  success(message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this._messages.push({message: message, type: InfraMessageType.Success});
    this.update();
  }

  error(message: string, deletePreviusMessage = true, keepAfterRouteChange = false, error: any = null) {
    this.post(deletePreviusMessage);
    if (error) {
      error = JSON.parse(JSON.stringify(error));
    }
    this._messages.push({message: message, type: InfraMessageType.Error, error: error});
    this.update();
  }

  info(message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this._messages.push({message: message, type: InfraMessageType.Info});
    this.update();
  }

  warn(message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this._messages.push({type: InfraMessageType.Warning, message});
    this.update();
  }

  add(messageType: InfraMessageType, message: string, deletePreviusMessage = true, keepAfterRouteChange = false) {
    this.post(deletePreviusMessage);
    this._messages.push( {message: message, type: messageType });
    this.update();
  }

  private post(deletePreviusMessage) {
    if (deletePreviusMessage) {
      this.clear();
    }
  }

  clear() {
    this._messages = [];
    this.update();
  }

  update() {
    this.subject.next([]);
    this.subject.next(this._messages);
  }

  isEmpty() {
    return this._messages.length === 0
  }
}

