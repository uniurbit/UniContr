
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
export class StrutturaEsternaService extends BaseService implements IQueryMetadata{
  getQueryMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'struest_nome',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Nome',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'struest_coduff',
        type: 'string',
        templateOptions: {
          label: 'Codice ufficio',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'struest_codfisc',
        type: 'string',
        templateOptions: {
          label: 'Codice fiscale',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
    ];
  }

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'nome',
        type: 'string',
        hideExpression: false,
        templateOptions: {
          label: 'Nome',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'cod_uff',
        type: 'string',
        templateOptions: {
          label: 'Codice struttura',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'indirizzo.value',
        type: 'string',
        templateOptions: {
          label: 'Indirizzo',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'email_certificata.addr',
        type: 'string',
        templateOptions: {
          label: 'Email certificata',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      
    ];

  }

  constructor(protected http: HttpClient, public messageService: MessageService,public confirmationDialogService: ConfirmationDialogService) {
     super(http,messageService,confirmationDialogService);
     this.basePath = 'struttureesterne';     
  }

}
