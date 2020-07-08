import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { DocumentoService } from '../services/documento.service';

@Component({
  selector: 'app-documenti',
  templateUrl: '../shared/base-component/base-research.component.html',
})

export class DocumentiTitulus extends BaseResearchComponent {
  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [
    {
      key: '/doc/@num_prot',
      type: 'string',
      hideExpression: false,
      templateOptions: {
        label: 'Numero protocollo',
        disabled: true,
        column: { width: 10, cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'doc_tipo',
      type: 'select',
      templateOptions: {
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
      templateOptions: {
        label: 'Anno',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'doc_oggetto',
      type: 'string',
      templateOptions: {
        label: 'Oggetto',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'doc_classifcod',
      type: 'string',
      templateOptions: {
        label: 'Classificazione',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
  ];

  resultMetadata: FormlyFieldConfig[] = [ {
    key: 'data',
    type: 'datatablelookup',
    wrappers: ['accordion'],
    templateOptions: {
      label: 'Risultati ricerca documenti',
      columnMode: 'force',
      scrollbarH: false,
      page: new Page(25),
      hidetoolbar: true,
      onDblclickRow: (event) => this.onDblclickRow(event),
      onSetPage: (pageInfo) => this.onSetPage(pageInfo),
    },
    fieldArray: {
      fieldGroupClassName: 'row',
      fieldGroup: this.fieldsRow,
    }
  }];

  builderoptions: FormlyTemplateOptions = {
    min: 1
  };

  constructor(protected service: DocumentoService, router: Router, route: ActivatedRoute) {
    super(router, route);
    this.resultMetadata[0].fieldArray.fieldGroup = service.getMetadata();
    this.enableNew = false;
    this.routeAbsolutePath = 'home/documenti';
    // this.title = 'Tipo pagamenti'
  }

}
