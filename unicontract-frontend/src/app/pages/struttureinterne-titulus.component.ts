import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { StrutturaInternaService } from '../services/strutturainterna.service';



@Component({
  selector: 'app-struttureinterne',
  templateUrl: '../shared/base-component/base-research.component.html',
})

// ng g c submission/components/permissions -s true --spec false -t true
export class StruttureInterneTitulus extends BaseResearchComponent {

  isLoading = false;

  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'struint_coduff',
            type: 'string',
            hideExpression: false,
            templateOptions: {
              label: 'Codice ufficio',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'struint_nome',
            type: 'string',
            templateOptions: {
              label: 'Nome struttura',
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
      label: 'Risultati strutture interne',
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

  constructor(protected service: StrutturaInternaService, router: Router, route: ActivatedRoute) {
    super(router, route);
    this.enableNew = false;
    this.resultMetadata[0].fieldArray.fieldGroup = service.getMetadata();

    this.routeAbsolutePath = 'home/struttureinterne';
    // this.title = 'Tipo pagamenti'
  }

}
