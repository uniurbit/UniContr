import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery, BaseService } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Cacheable } from 'ngx-cacheable';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class UserService extends BaseService  {

    getMetadata(): FormlyFieldConfig[] {
        return  [
        {
            key: 'id',
            type: 'number',
            hideExpression: false,
            templateOptions: {
            label: 'Id',
            disabled: true,
            column: { width: 10, cellTemplate: 'valuecolumn'}
            }
        },
        {
            key: 'name',
            type: 'string',
            templateOptions: {
            label: 'Nome utente',
            required: true,
            column: { cellTemplate: 'valuecolumn'}
            }
        },
        {
            key: 'email',
            type: 'string',
            templateOptions: {
            label: 'Email',
            required: true,
            column: { cellTemplate: 'valuecolumn'}
            }
        }
        ];
    }

    constructor(protected http: HttpClient,
                public messageService: MessageService,
                public confirmationDialogService: ConfirmationDialogService) {
        super(http, messageService, confirmationDialogService);
        this.basePath = 'users';
    }

    getUsers(model): Observable<any> {
        return this.http
        .get<any>(this._baseURL + '/users', { headers: httpOptions.headers, params: model }).pipe(
            tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
            catchError(this.handleError('getusers'))
        );
    }

    @Cacheable()
    getRoles(): Observable<any> {
        return this.http
        .get<any>(this._baseURL + '/users/roles', { headers: httpOptions.headers}).pipe(
            // tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
            catchError(this.handleError('getRoles'))
        );
    }

    @Cacheable()
    getPermissions(): Observable<any> {
        return this.http
        .get<any>(this._baseURL + '/users/permissions', { headers: httpOptions.headers}).pipe(
            // tap(sub => this.messageService.info('Lettura utenti effettuata con successo')),
            catchError(this.handleError('getPermissions'))
        );
    }

}
