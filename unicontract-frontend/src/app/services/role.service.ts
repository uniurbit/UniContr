import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { MessageService, ServiceQuery, ServiceEntity, BaseService } from '../shared';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Cacheable } from 'ts-cacheable';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class RoleService extends BaseService {

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'id',
        type: 'number',
        hideExpression: false,
        templateOptions: {
          label: 'Id',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'name',
        type: 'select',
        templateOptions: {
          label: 'Ruolo',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'guard_name',
        type: 'string',
        templateOptions: {
          label: 'Nome',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
    ];

  }

  constructor(protected http: HttpClient,
              public messageService: MessageService,
              public confirmationDialogService: ConfirmationDialogService) {
    super(http, messageService, confirmationDialogService);
    this.basePath = 'roles';
  }

  @Cacheable()
  getPermissions(): Observable<any> {
    return this.http
      .get<any>(this._baseURL + '/users/permissions', { headers: httpOptions.headers }).pipe(
        catchError(this.handleError('getPermissions'))
      );
  }

}
