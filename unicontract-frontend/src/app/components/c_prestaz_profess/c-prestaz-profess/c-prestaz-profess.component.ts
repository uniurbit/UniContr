import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdC } from './../../../classes/precontrattuale';
import { CPrestazProfess } from './../../../classes/cPrestazProfess';
import { CPrestazProfessService } from './../../../services/cPrestazProfess.service';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { B2IncompatibilitaInterface } from 'src/app/interface/b2incompatibilita.interface';


@Component({
  selector: 'app-c-prestaz-profess',
  templateUrl: './c-prestaz-profess.component.html',
  styleUrls: ['./c-prestaz-profess.component.css']
})

export class CPrestazProfessComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdC;
  idins: number;

  formAttch = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields1: FormlyFieldConfig[] = [
    {
      template: '<h5>' + this.translateService.instant('c_intest1') + '</h5>'
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'piva',
          type: 'input',
          className: 'col-md-6',
          // validation: {
          //   show: true
          // },
          templateOptions: {
            minLength: 11,
            maxLength: 11,
            translate: true,
            label: 'c_label1',
            required: true,
            // pattern: /^[0-9]{11}$/
          }
        },
        {
          key: 'intestazione',
          type: 'input',
          className: 'col-md-6',
          // validation: {
          //   show: true
          // },
          templateOptions: {
            translate: true,
            label: 'c_label2',
            required: true,
          }
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'select',
          key: 'tipologia',
          className: 'col-md-6',
          // validation: {
          //   show: true
          // },
          templateOptions: {
            options: [
              {key: 0, value: this.translateService.instant('c_label4')},
              {key: 1, value: this.translateService.instant('c_label5')}
            ],
            required: true,
            translate: true,
            label: 'c_label3'
          },
        }
      ],
    }
  ];

  fields2: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_albo',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          templateOptions: {
            change: (field, $event) => {
              if (field.model.flag_albo === false || field.model.flag_albo === 0) {
                this.model.denominazione_albo = null;
                this.model.provincia_albo = null;
                this.model.num_iscrizione_albo = null;
                this.model.data_iscrizione_albo = null;
              }
            }
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_albo === false || model.flag_albo === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('c_intest2') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'input',
          key: 'denominazione_albo',
          className: 'col-md-4',
          templateOptions: {
            translate: true,
            label: 'c_label6',
            required: true,
          }
        },
        {
          type: 'input',
          key: 'provincia_albo',
          className: 'col-md-2',
          templateOptions: {
            translate: true,
            label: 'c_label7',
            required: true,
          }
        },
        {
          type: 'input',
          key: 'num_iscrizione_albo',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'c_label8',
            required: true,
          }
        },
        {
          type: 'date',
          key: 'data_iscrizione_albo',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'c_label9',
            required: true,
          }
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.flag_albo === 0 || model.flag_albo === false) {
          return model;
        }
      },
    }
  ];

  fields3: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_cassa',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          templateOptions: {
            change: (field, $event) => {
              if (field.model.flag_cassa === false || field.model.flag_cassa === 0) {
                this.model.denominazione_cassa = null;
                this.model.contributo_cassa = 0;
              }
            }
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_cassa === false || model.flag_cassa === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('c_intest3') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'input',
          key: 'denominazione_cassa',
          className: 'col-md-6',
          templateOptions: {
            translate: true,
            label: 'c_label10',
            required: true,
          }
        },
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.flag_cassa === 0 || model.flag_cassa === false) {
          return model;
        }
      },
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'radio',
          key: 'contributo_cassa',
          className: 'col-md-6',
          defaultValue: 0,
          templateOptions: {
            formCheck: 'inline',
            options: [
              {key: 1, value: '2%'},
              {key: 0, value: '4%'}
            ],
            translate: true,
            label: 'c_label11'
          },
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.flag_cassa === 0 || model.flag_cassa === false) {
          return model;
        }
      },
    }
  ];

  fields4: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_rivalsa',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          templateOptions: {
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_rivalsa === false || model.flag_rivalsa === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('c_intest4') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },

    {
      fieldGroup: [
        {
          template: '<p>' + this.translateService.instant('c_txt1') + '</p>'
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.flag_rivalsa === 0 || model.flag_rivalsa === false) {
          return model;
        }
      },
    }
  ];

  fields5: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_regime_fiscale',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          templateOptions: {
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_regime_fiscale === false || model.flag_regime_fiscale === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('c_intest5') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },

    {
      fieldGroup: [
        {
          template: '<p>' + this.translateService.instant('c_txt2') + '</p>'
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.flag_regime_fiscale === 0 || model.flag_regime_fiscale === false) {
          return model;
        }
      },
    }
  ];

  fields: FormlyFieldConfig[] = [
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields1,
    },
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields2,
    },
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields3,
    },
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields4,
    },
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields5,
    },
  ];


  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private pivaService: CPrestazProfessService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,              
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;          
          this.pivaService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                this.model = response['datiPrecontrattuale']['copy'];
              }
              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.pivaService.getPrestazProfess(+params.get('id')).subscribe(
            response => {
              this.model = response['datiPIva'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idC: number) {
    this.isLoading = true;
    if (idC === 0) {
      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      this.newPrestProfess(preStore);
    } else {
      this.updateC(this.model, idC);
    }
  }

  newPrestProfess(prestaz: any) {    
    this.precontrattualeService.newPrestazProfess(prestaz).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello C: Prestazione Professionale creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          const id = response['data']['c_prestaz_profess_id'];         
          this.router.navigate(['home/cpiva/details', id]);
        } else {
          this.messageService.error(response['message']);
        }      
      }
    );
  }

  updateC(prestaz: any, idC: number) {    
    this.pivaService.updatePrestazProfess(prestaz, idC).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello C: Prestazione Professionale aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }     
        this.router.navigate(['home/cpiva/details', idC]);
      }
    );
  }

}
