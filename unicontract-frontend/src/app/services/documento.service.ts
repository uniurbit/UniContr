
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery, ServiceEntity, IQueryMetadata } from '../shared';
import { ArrayControl } from '../shared/dynamic-form/control-array';
import { FormlyFieldConfig  } from '@ngx-formly/core';
import { AppConstants } from '../app-constants';
import { Cacheable } from 'ts-cacheable';
import { BaseService } from '../shared/base-service/base.service';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class DocumentoService extends BaseService implements IQueryMetadata{
  getQueryMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'docnumprot', // '/doc/@num_prot',
        type: 'string',
        props: {
          type: 'index',
          label: 'Numero protocollo',
          required: true,
          column: { width: 10, cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'doc_tipo',
        type: 'select',
        props: {
          label: 'Tipo',
          required: true,
          options: [
            { value: 'arrivo', label: 'Arrivo'},
            { value: 'partenza', label: 'Partenza'},
            { value: 'interno', label: 'Interno '},
            { value: 'varie', label: 'Varie'},
          ],
          column: { cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'doc_anno',
        type: 'string',
        props: {
          type: 'index',
          label: 'Anno',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'doc_oggetto',
        type: 'string',
        props: {
          label: 'Oggetto',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }
      },
      {
        key: 'doc_classifcod',
        type: 'string',
        props: {
          label: 'Classificazione',
          required: true,
          column: { cellTemplate: 'valuecolumn'}
        }
      },
    ];
  }

  getMetadata(): FormlyFieldConfig[] {
    return [
      {
        key: 'oggetto',
        type: 'string',
        props: {
          label: 'Oggetto',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'num_prot',
        type: 'string',
        props: {
          label: 'Numero protocollo',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'data_prot',
        type: 'string',
        props: {
          label: 'Data registrazione',
          required: true,
          column: { cellTemplate: 'valuecolumn' }
        }
      },
      {
        key: 'tipo',
        type: 'string',
        hideExpression: false,
        props: {
          label: 'Tipo',
          disabled: true,
          column: { width: 10, cellTemplate: 'valuecolumn' }
        }
      },
    ];

  }

  // tslint:disable-next-line:max-line-length
  constructor(protected http: HttpClient, public messageService: MessageService, public confirmationDialogService: ConfirmationDialogService) {
     super(http, messageService, confirmationDialogService);
     this.basePath = 'documenti';
  }

}
