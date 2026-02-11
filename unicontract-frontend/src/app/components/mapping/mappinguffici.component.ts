import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared';
import { MappingUfficioService } from 'src/app/services/mappingufficio.service';



@Component({
    selector: 'app-mappinguffici',
    templateUrl: '../../shared/base-component/base-research.component.html',
    standalone: false
})

//ng g c application/pages/mappinguffici -s true --spec false -t true
export class MappingUfficiTitulus extends BaseResearchComponent {
  
  isLoading = false;
  
  fieldsRow: FormlyFieldConfig[] = [    
          {
            key: 'unitaorganizzativa_uo',
            type: 'string',
            hideExpression: false,
            props: {
              label: 'Codice unità organizzativa',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'descrizione_uo',
            type: 'string',
            props: {
              label: 'Descrizione unità organizzativa',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },        
          {
            key: 'strutturainterna_cod_uff',
            type: 'string',
            hideExpression: false,
            props: {
              label: 'Codice struttura interna',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'descrizione_uff',
            type: 'string',
            props: {
              label: 'Descrizione struttura interna',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },        
        ];
   
 
  resultMetadata: FormlyFieldConfig[] = [ {
    key: 'data',
    type: 'datatablelookup',
    wrappers: ['accordion'],      
    props: {      
      label: 'Associazioni strutture',   
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

  builderoptions:  FormlyFieldProps = {
    min: 0
  }

  constructor(protected service: MappingUfficioService, router: Router, route: ActivatedRoute,)  {    
    super(router,route);    
    
    this.resultMetadata[0].fieldArray = { fieldGroup: service.getMetadata()};         

    this.routeAbsolutePath = 'home/mappinguffici'     
    
  }
 
}
