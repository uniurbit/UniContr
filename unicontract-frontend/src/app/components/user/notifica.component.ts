import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import { SourceMapGenerator } from '@angular/compiler/src/output/source_map';
import { Location } from '@angular/common';
import { NotificaService } from '../../shared/notifica.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notifica',
  templateUrl: '../../shared/base-component/base-entity.component.html',
})

// ng g c submission/components/user -s true --spec false -t true

export class NotificaComponent extends BaseEntityComponent {
  isLoading = true;

  fields_vincolo_anno_rapporto: FormlyFieldConfig[] = [
    {
      key: 'vincolo_anno',
      type: 'select',
      templateOptions: {
        required: true,
        label: 'Vincolo minimo anno accademico',        
        options: this.service.getAnniAccademici()            
      }
    },
    {
      key: 'vincolo_natura_rapporto',
      type: 'select',
      templateOptions: {
        required: true,
        label: 'Vincolo tipologia di prestazione',        
        options: []
      },
      expressionProperties: {
        'templateOptions.options': (model: any, formState: any, field: FormlyFieldConfig) => {        
          return this.opt;
        },
      }
    },
  ]

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',
          className: 'col-md-2',
          templateOptions: {
            label: 'Id',
            disabled: true,
          },
          hideExpression: (model: any) => !model.id
        },
      ]
    },
    {
      key: 'messaggio',
      type: 'textarea',
      templateOptions: {
        rows: 3,
        label: 'Messaggio',
        required: true
      }
    },
    {
      key: 'riferimento',
      type: 'select',
      templateOptions: {
        label: 'Riferimento',
        valueProp: 'value',
        labelProp: 'label',
        options: [
          {value: 'contratto', label: 'Contratto'},  
          {value: 'generale', label: 'Generale'},          
        ]
      },
    },   
    //primario, secondario, eseguito, attenzione, evidenza, info, chiaro, scuro
    {
      key: 'priorita',
      type: 'select',
      templateOptions: {
        label: 'Priorità',        
        options: [
          {value: 'primary', label: 'Primario'},
          {value: 'secondary', label: 'Secondario'},
          {value: 'success', label: 'Successo'},
          {value: 'warning', label: 'Attenzione'},
          {value: 'danger', label: 'Evidenza'},
          {value: 'info', label: 'Info'},
          {value: 'light', label: 'Chiaro'},
          {value: 'dark', label: 'Scuro'}
        ]
      },
    },
    {
      key: 'stato',
      type: 'select',
      templateOptions: {
        label: 'Stato',
        required: true,        
        options: [
          {value: 'attivo', label: 'Attivo'},          
          {value: 'disattivo', label: 'Disattivo'}          
        ]
      },
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'data_inizio',
          type: 'datepicker',
          className: 'col-md',
          templateOptions: {
            required: true,
            translate: true,
            label: 'Data inizio',
          },
        },
        {
          key: 'data_fine',
          type: 'datepicker',
          className: 'col-md',
          templateOptions: {
            required: true,
            translate: true,
            label: 'Data fine',
          },
        },
      ]
    },
    {
      key: 'tipo_vincolo',
      type: 'select',
      templateOptions: {
        required: true,
        label: 'Vincolo',        
        options: [
          {value: 'vincolo_anno_rapporto', label: 'Vincolo minimo anno e natura rapporto'},
          {value: 'vincolo_nessuno', label: 'Nessuno'}
        ]
      }      
    },
    {            
      key: "dati",     
      fieldGroup: [
        {
          fieldGroup: this.fields_vincolo_anno_rapporto,
          hideExpression: (model: any, formState: any, field) => {
            return field.parent.parent.model.tipo_vincolo != 'vincolo_anno_rapporto'
          }
        }        
      ]
    }
  ];

  opt = []

  constructor(protected service: NotificaService, protected route: ActivatedRoute, protected router: Router, protected location: Location, protected translateService: TranslateService) {
    super(route, router, location);
    // this.title = "Ruolo";
    this.activeNew = true;
    this.newPath = 'home/notifiche/new';
    this.researchPath = 'home/notifiche';

    this.opt =  [{ value: 'PRPR', label: this.translateService.instant('p3_radio1') }];         
    this.opt.push({ value: 'COCOCO', label: this.translateService.instant('p3_radio2') });
    this.opt.push( { value: 'PLAO', label: this.translateService.instant('p3_radio3') });
    this.opt.push( { value: 'PTG', label: this.translateService.instant('p3_radio4') });
    this.opt.push( { value: 'ALD', label: this.translateService.instant('p3_radio5') });

  }

  onDblclickRow(event) {
    // , {relativeTo: this.route}
    if (event.type === 'dblclick') {
      if (event.row.id) {
        this.router.navigate(['home/notifiche', event.row.id]);
      }
    }
  }

  onReload() {
    if (this.model['id']) {
      this.isLoading = true;
      this.service.getById(this.model['id']).subscribe((data) => {
        this.model = JSON.parse(JSON.stringify(data));
        this.options.updateInitialValue();
        this.isLoading = false;
      },
        error => {
          this.isLoading = false;
          // this.service.messageService.error(error);
        });
    }
  }



}
