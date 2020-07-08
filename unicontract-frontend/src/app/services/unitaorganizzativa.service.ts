import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ControlBase, TextboxControl, DropdownControl, DateControl, MessageService, ServiceQuery, ServiceEntity } from '../shared';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseService } from '../shared/base-service/base.service';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class UnitaOrganizzativaService extends BaseService {

    getMetadata(): FormlyFieldConfig[] {
        return [
        {
            key: 'uo',
            type: 'string',
            hideExpression: false,
            templateOptions: {
            label: 'Codice unità organizzativa',
            disabled: true,
            column: { width: 10, cellTemplate: 'valuecolumn' }
            }
        },
        {
            key: 'descr',
            type: 'string',
            templateOptions: {
            label: 'Descrizione',
            required: true,
            column: { cellTemplate: 'valuecolumn' }
            }
        },
        {
            key: 'data_fin',
            type: 'date',
            templateOptions: {
            label: 'Data fine',
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
        this.basePath = 'unitaorganizzative';
    }

}
