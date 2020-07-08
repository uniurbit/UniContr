
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery, ServiceEntity, IQueryMetadata } from '../shared';
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
export class LogAttivitaService extends BaseService implements IQueryMetadata{
  getQueryMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'subject',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Oggetto',
          disabled: true,
          column: { width: 30, cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'url',
        type: 'string',
        templateOptions: {
          label: 'Url',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'method',
        type: 'string',
        templateOptions: {
          label: 'Metodo',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'ip',
        type: 'string',
        templateOptions: {
          label: 'IP',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'agent',
        type: 'string',
        templateOptions: {
          label: 'Agent',
          required: true,
          column: { width: 200, cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'request',
        type: 'string',
        templateOptions: {
          label: 'Richiesta',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'user_id',
        type: 'external',
        wrappers: [],
        templateOptions: {
          label: 'Codice utente',
          type: 'string',
          entityName: 'user',
          entityLabel: 'Utenti',
          codeProp: 'id',
          descriptionProp: 'name',
          column: { cellTemplate: 'valuecolumn' }
        },
      },
      {
        key: 'created_at',
        type: 'date',
        templateOptions: {
          label: 'Data operazione',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      }
    ];
  }

  getMetadata(): FormlyFieldConfig[] {
    return  [{
      key: 'subject',
      type: 'string',
      hideExpression: false,
      templateOptions: {
        label: 'Oggetto',
        disabled: true,
        column: { width: 30, cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'url',
      type: 'string',
      templateOptions: {
        label: 'Url',
        required: true,
        column: { cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'method',
      type: 'string',
      templateOptions: {
        label: 'Metodo',
        required: true,
        column: {  width: 30, cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'ip',
      type: 'string',
      templateOptions: {
        label: 'IP',
        required: true,
        column: { cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'agent',
      type: 'string',
      templateOptions: {
        label: 'Agent',
        required: true,
        column: { width: 300, cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'request',
      type: 'string',
      templateOptions: {
        label: 'Richiesta',
        required: true,
        column: { width: 300, cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'user_id',
      type: 'string',
      templateOptions: {
        label: 'Codice utente',
        required: true,
        column: { width: 30, cellTemplate: 'valuecolumn' }
      }
    },
    {
      key: 'created_at',
      type: 'string',
      templateOptions: {
        label: 'Data operazione',
        required: true,
        column: { cellTemplate: 'valuecolumn' }
      }
    },
  ];

  }

  constructor(protected http: HttpClient, public messageService: MessageService,public confirmationDialogService: ConfirmationDialogService) {
     super(http,messageService,confirmationDialogService);
     this.basePath = 'logattivita';     
  }

}
