import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyTemplateOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared';
import { MappingRuoloService } from 'src/app/services/mappingruolo.service';

@Component({
  selector: 'app-mappingruoli',
  templateUrl: '../../shared/base-component/base-research.component.html',
})

// ng g c application/pages/mappinguffici -s true --spec false -t true
export class MappingRuoli extends BaseResearchComponent {

  isLoading = false;

  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'unitaorganizzativa_uo',
            type: 'string',
            hideExpression: false,
            templateOptions: {
              label: 'Codice unità organizzativa',
              disabled: true,
              column: { width: 5, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'descrizione_uo',
            type: 'string',
            templateOptions: {
              label: 'Descrizione',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'role_id',
            type: 'number',
            templateOptions: {
              label: 'Codice ruolo',
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
      label: 'Risultati associazione ruoli',
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
    min: 0
  };

  constructor(protected service: MappingRuoloService, router: Router, route: ActivatedRoute)  {
    super(router, route);
    this.resultMetadata[0].fieldArray = { fieldGroup: service.getMetadata()}; 
    this.routeAbsolutePath = 'home/mappingruoli';
  }

}
