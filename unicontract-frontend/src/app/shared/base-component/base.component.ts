import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
    selector: 'app-base',
    template: 'NO UI',
    styleUrls: ['./base.component.css'],
    standalone: false
})
export class BaseComponent implements OnInit, OnDestroy {

  public isLoading = false;
  protected onDestroy$ = new Subject<void>();
  
  update: boolean = true;

  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  handleError(error): void {
    this.isLoading = false;    
    this.messageService.error(`L'operazione è terminata con errori: ${error.message}`, true, false, error);
    //this.messageService.error(`L'operazione è terminata con errori: ${error.message}`);        
  }

  complete(message = true) {
    this.isLoading = false;
    if (message){
      this.messageService.info('Lettura effettuata con successo');
    }
    //if (this.messageService.isEmpty()) {
      
    //}
  }

}
