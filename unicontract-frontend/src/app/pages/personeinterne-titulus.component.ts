import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { PersonaInternaService } from '../services/personainterna.service';



@Component({
  selector: 'app-personeinterne',
  templateUrl: '../shared/base-component/base-research.component.html',
})

// ng g c submission/components/permissions -s true --spec false -t true
export class PersoneinterneTitulus extends BaseResearchComponent {

  isLoading = false;

  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'persint_coduff',
            type: 'external',
            templateOptions: {
              label: 'Codice ufficio',
              type: 'string',
              entityName: 'strutturainterna',
              entityLabel: 'Strutture interne',
              codeProp: 'cod_uff',
              descriptionProp: 'nome',
              description: 'Codice ufficio'
            },
          },
          {
            key: 'persint_matricola',
            type: 'string',
            hideExpression: false,
            templateOptions: {
              label: 'Matricola',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'persint_nomcogn',
            type: 'string',
            templateOptions: {
              label: 'Nome e/o cognome',
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
      label: 'Risultati persone interne',
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

  constructor(protected service: PersonaInternaService, router: Router, route: ActivatedRoute)  {
    super(router, route);
    this.enableNew = false;
    this.resultMetadata[0].fieldArray.fieldGroup = service.getMetadata();

    this.routeAbsolutePath = 'home/personeinterne';
    // this.title = 'Tipo pagamenti'
  }

}
