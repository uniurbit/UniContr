
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery, ServiceEntity } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Cacheable } from 'ngx-cacheable';
import { BaseService } from '../shared/base-service/base.service';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class MappingRuoloService extends BaseService {

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'unitaorganizzativa_uo',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Codice unità organizzativa',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'descrizione_uo',
        type: 'string',
        templateOptions: {
          label: 'Descrizione unità organizzativa',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'role_id',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Codice ruolo',
          disabled: true,
          column: { width: 3, cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'role.name',
        type: 'string',
        templateOptions: {
          label: 'Ruolo',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }
      },
    ];

  }

  // tslint:disable-next-line:max-line-length
  constructor(protected http: HttpClient, public messageService: MessageService, public confirmationDialogService: ConfirmationDialogService) {
     super(http, messageService, confirmationDialogService);
     this.basePath = 'mappingruoli';
  }

}
