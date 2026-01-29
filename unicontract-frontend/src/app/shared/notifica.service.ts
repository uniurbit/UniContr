import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import { INotifica } from './view-notifiche/notifica.model';

import { MessageService } from './message.service';
import { BaseService } from './base-service/base.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class NotificaService extends BaseService {

  private _notifiche$: BehaviorSubject<INotifica[]> = new BehaviorSubject(null);

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'id',
        type: 'number',
        hideExpression: false,
        props: {
          label: 'Id',
          disabled: true,      
        }
      },
      {
        key: 'messaggio',
        type: 'input',
        props: {
          label: 'Messaggio',
          required: true,
        }
      },      
    ];

  }

  constructor(protected http: HttpClient,
              public messageService: MessageService,
              public confirmationDialogService: ConfirmationDialogService,
             ) {

    super(http, messageService, confirmationDialogService);
    this.basePath = 'notifiche';
  }

  public newNotifiche(notifiche: INotifica[], riferimento: string = null){    
    if (riferimento && this.currentNotifiche){
      //mantengo le notifiche diverse dal riferimento
      const current = this.currentNotifiche.filter(x => x.riferimento != riferimento);
      this._notifiche$.next(notifiche.concat(current));  
    }else{
      this._notifiche$.next(notifiche);
    }
    
    
  }
  
  get notifiche$() {
    return this._notifiche$.asObservable();
  }

  get currentNotifiche() {
    return this._notifiche$.getValue()
  }


}
