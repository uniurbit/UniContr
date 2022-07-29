import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdD4 } from './../../../classes/precontrattuale';
import { D4Fiscali } from './../../../classes/d4fiscali';
import { D4FiscaliService } from './../../../services/d4fiscali.service';
import { StoryProcessService } from './../../../services/storyProcess.service';
import { StoryProcess } from './../../../classes/storyProcess';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';

@Component({
  selector: 'app-d4-fiscali',
  templateUrl: './d4-fiscali.component.html',
  styleUrls: ['./d4-fiscali.component.css']
})

export class D4FiscaliComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdD4;
  idins: number;
  story: StoryProcess;

  // Legge di bilancio 2022 cambio delle aliquote fiscali commentante quelle modifiche e eliminate
  aliquote: Array<Object> = [
    {aliquota: '23', name: '23 %'},
    {aliquota: '25', name: '25 %'},
    //{aliquota: '27', name: '27 %'},
    {aliquota: '35', name: '35 %'},
    //{aliquota: '38', name: '38 %'},
    //{aliquota: '41', name: '41 %'},
    {aliquota: '43', name: '43 %'},
  ];  

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
      template: '<h5>' + this.translateService.instant('d4_intest1') + '</h5>'
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'percentuale_aliquota_irpef',
          type: 'select',
          className: 'col-md-3',
          defaultValue: '23',
          templateOptions: {
            options: this.aliquote,
            valueProp: 'aliquota',
            labelProp: 'name',
            translate: true,
            label: 'd4_txt1',
            required: true,
            description: this.translateService.instant('d4_label'),
          }
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          //Modifiche _2022 dovute alla modifica delle aliquote fiscali Legge bilancio 2022
          template: '<p><b>' + this.translateService.instant('d4_nota1') + '</b><br>'
          + this.translateService.instant('d4_nota3') + '<br>'
          + this.translateService.instant('d4_nota4_2022') + '<br>'
          + this.translateService.instant('d4_nota5_2022') + '<br>'
          + this.translateService.instant('d4_nota6_2022') + '</p>',
          //+ this.translateService.instant('d4_nota7') + '</p>',
          className: 'col-auto'
        }
      ]
    }
  ];

  //detrazioni 
  fields2: FormlyFieldConfig[] = [
    {
      template: '<h5>' + this.translateService.instant('d4_intest2_1') + '</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_detrazioni',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          templateOptions: {
            change: (field, $event) => {
              if (field.model.flag_detrazioni === false || field.model.flag_detrazioni === 0) {
                //field.model.detrazioni = null;
                //field.model.reddito = null;

                if (field.model.flag_bonus_renzi != null){
                  field.form.get('flag_bonus_renzi').setValue(0);                  
                } 
                if (field.model.flag_detrazioni_21_2020 != null){
                  field.form.get('flag_detrazioni_21_2020').setValue(0);
                } 

              }
            }
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_detrazioni === false || model.flag_detrazioni === 0) {
                return 'NO '+this.translateService.instant('d4_intest2');
              } else {
                return 'SÌ '+this.translateService.instant('d4_intest2');
              }
            }
          },

         //validazione SOLO su modifica e con il riquadro D6 compilato fare questa validazione 
         validators: {
          compatibility_detr: ctrl => {
            //sono in aggiornamento
            //il valore è falso
            // e la richiesta detrazioni familiari è vera
            if (this.update && 
                !ctrl.value && 
                (this.items.flag_richiesta_detrazioni === true || this.items.flag_richiesta_detrazioni === 1))
              return false;
            return true;
          }
        },
        validation: {
          show: true,
          messages: {
            compatibility_detr: 'Scelta non compatibile con riquadro D6 "'+this.translateService.instant('d6_intest2')+'" a SÌ',
          }
        }, 
          
        },

      ]
    },
    {
      fieldGroup: [
        {
          type: 'radio',
          key: 'detrazioni',
          templateOptions: {
            options: [
              {key: 'RCC', value: this.translateService.instant('d4_txt5')},
              {key: 'RCD', value: this.translateService.instant('d4_txt6')}
            ],
            required: true,
            translate: true,
            // tslint:disable-next-line:max-line-length
            label: this.translateService.instant('d4_txt3b') + ' ' +  this.translateService.instant('d4_txt4')
          },
        }
      ],
      hideExpression: (model, formstate) => {
        return (this.model.flag_detrazioni === 0 || this.model.flag_detrazioni === false);
      }
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'reddito',
          type: 'maskcurrency',
          className: 'col-md-3',
          templateOptions: {
            required: true,
            translate: true,
            label: 'd4_label2'
          },
        },
      ],
      hideExpression: (model, formstate) => {
        return (this.model.detrazioni !== 'RCD' || (this.model.flag_detrazioni === 0 || this.model.flag_detrazioni === false));
      }
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          template: '<p>' + this.translateService.instant('d4_nota2') + '</p>',
          className: 'col-auto'
        }
      ],
      hideExpression: (model, formstate) => {
        return (this.model.detrazioni !== 'RCD');
      }
    }
  ];

  //bonus renzi valido per contratti che prima del 30/06/2020
  //validazione a si solo se flag_detrazioni è a true
  fields3: FormlyFieldConfig[] = [
    {
      template: '<h5>' + this.translateService.instant('d4_intest3_1') + '</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_bonus_renzi',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,       
          templateOptions: {            
          },
          hooks: {
            onInit(field) {
              const control = field.formControl;
              if (control.value === null) {
                control.setValue(0);
              }
            }
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_bonus_renzi === false || model.flag_bonus_renzi === 0) {
                return 'NO '+ this.translateService.instant('d4_intest3');
              } else {
                return 'SÌ '+this.translateService.instant('d4_intest3');
              }              
            },
            //se flag_detrazioni === false il controllo deve essere disabilitato sul NO
            // 'templateOptions.disabled': (model: any, formState: any, field: FormlyFieldConfig) => {
            //   if (model.flag_detrazioni === false || model.flag_detrazioni === 0)
            //     return true;
            //   return false;
            // }
          },
          //validazione SOLO su modifica flag_detrazioni == 1
          validators: {
            compatibility_detr: ctrl => {
              if (ctrl.value && (ctrl.parent.get('flag_detrazioni').value === false ||ctrl.parent.get('flag_detrazioni').value === 0))
                return false;
              return true;
            }
          },
          validation: {
            show: true,
            messages: {
              compatibility_detr: 'Scelta non compatibile con "'+this.translateService.instant('d4_intest2')+'" a NO',
            }
          }, 
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          template: '<p>' + this.translateService.instant('d4_txt7') + '</p>',
          className: 'col-auto'
        }
      ],
      hideExpression: (model, formstate) => {
        return (this.model.flag_bonus_renzi === 0 || this.model.flag_bonus_renzi === false);
      }
    },
  ];

  //valido per contratti che iniziano dopo il 1/7/2020
  fields4: FormlyFieldConfig[] = [
    {
      template: '<h5>' + this.translateService.instant('d4_intest4_1') + '</h5>',
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_detrazioni_21_2020',
          className: 'custom-switch pl-4 pr-2 pt-1',
          defaultValue: false,
          templateOptions: {
            change: (field, $event) => {
              if (field.model.flag_detrazioni_21_2020 === false || field.model.flag_detrazioni_21_2020 === 0) {
                this.model.detrazioni_21_2020 = null;
                this.model.reddito_21_2020 = null;
              }
            }
          },
          hooks: {
            onInit(field) {
              const control = field.formControl;
              if (control.value === null) {
                control.setValue(0);
              }
            }
          },
          expressionProperties: {
            'templateOptions.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_detrazioni_21_2020 == null || model.flag_detrazioni_21_2020 === false || model.flag_detrazioni_21_2020 === 0) {
                return 'NO '+ this.translateService.instant('d4_intest4');
              } else {
                return 'SÌ '+ this.translateService.instant('d4_intest4');
              }
            },
            //se flag_detrazioni === false il controllo deve essere disabilitato sul NO
            // 'templateOptions.disabled': (model: any, formState: any, field: FormlyFieldConfig) => {
            //   if (model.flag_detrazioni === false || model.flag_detrazioni === 0)
            //     return true;
            //   return false;
            // }
          },
         //validazione SOLO su modifica flag_detrazioni == 1
         validators: {
          compatibility_detr: ctrl => {
            if (ctrl.value && (ctrl.parent.get('flag_detrazioni').value === false ||ctrl.parent.get('flag_detrazioni').value === 0))
              return false;
            return true;
          }
        },
        validation: {
          show: true,
          messages: {
            compatibility_detr: 'Scelta non compatibile con "'+this.translateService.instant('d4_intest2')+'" a NO',
          }
        },
          
        },
      
      ]
    },

    // {
    //   fieldGroup: [
    //     {
    //       type: 'radio',
    //       key: 'detrazioni_21_2020',
    //       templateOptions: {
    //         options: [
    //           {key: 'TI21', value: this.translateService.instant('d4_txt7_ti21')},
    //           {key: 'D21', value: this.translateService.instant('d4_txt8_d21')}
    //         ],
    //         required: true,
    //         translate: true,
    //         // tslint:disable-next-line:max-line-length
    //         label: this.translateService.instant('d4_txt9_detrazioni_21')
    //       },
    //       expressionProperties: {
    //         'templateOptions.description': (model: any, formState: any, field: FormlyFieldConfig) => {
    //           switch (model.detrazioni_21_2020) {
    //             case 'TI21': {
    //                return this.translateService.instant('d4_nota_ti21');
    //             }
    //             case 'D21': {
    //                return this.translateService.instant('d4_nota_d21');
    //             }
    //             default: {
    //                return '';
    //             }
    //           }
    //         }
    //       }
    //     }
    //   ],
    //   hideExpression: (model, formstate) => {
    //     return (model.flag_detrazioni_21_2020 == null || model.flag_detrazioni_21_2020 === 0 || model.flag_detrazioni_21_2020 === false);
    //   }
    // },
    // {
    //   fieldGroupClassName: 'row',
    //   fieldGroup: [
    //     {
    //       key: 'reddito_21_2020',
    //       type: 'maskcurrency',
    //       className: 'col-md-3',
    //       templateOptions: {
    //         required: true,
    //         translate: true,
    //         label: 'd4_label3_21'
    //       },
         
    //     },
    //   ],
    //   hideExpression: (model, formstate) => {
    //     return (model.detrazioni_21_2020 !== 'D21' || model.flag_detrazioni_21_2020 === 0 || model.flag_detrazioni_21_2020 === false);
    //   }
      
    // },
  ];


  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d4Service: D4FiscaliService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,
              private storyService: StoryProcessService,
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.d4Service.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                this.model = this.validationCopyRules(copy); 
              }
              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.d4Service.getDatiFiscali(+params.get('id')).subscribe(
            response => {
              this.model = response['datiFiscali'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  validationCopyRules(copy: any){
    if (!this.valido_bonus_renzi()){
      copy.flag_bonus_renzi = null;
    }
    return copy;   
  }

  saveData(idD4: number) {
    this.isLoading = true;
    if (!this.valido_bonus_renzi_data()){
      this.model.flag_bonus_renzi = null;
    }
    if (idD4 === 0) {
      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };

      this.newFiscali(preStore);
    } else {
      this.updateD4(this.model, idD4);
    }
  }

  newFiscali(fiscali: any) {
    this.d4Service.newDatiFiscali(fiscali).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiFiscali']['id']; // RETURN LAST ID

        if (response['success']) {
          this.messageService.info('Modello D.4: Richiesta ai fini fiscali creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          this.precontr = new UpdD4();
          this.precontr.insegn_id = this.idins;
          this.precontr.d4_fiscali_id = lastid;
          this.router.navigate(['home/fiscali/details',  this.precontr.d4_fiscali_id ]);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }
 
  updateD4(tribut: any, idD4: number) {

    this.d4Service.updateDatiFiscali(tribut, idD4).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.4: Richiesta ai fini fiscali aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/fiscali/details', idD4]);
      }
    );
  }

  //se dopo il 30/06/2020
  valido_bonus_renzi(){
    //se il contratto è in aggiornamento 
    if (this.update){
      //e il valore è nullo
      if (this.model.flag_bonus_renzi == null){
        return false;
      } 
      return true;
    }else{
      //se il modello è nuovo
      const endDate = new Date(2020,5,30);
      const data_ini_contr = new Date(this.items.data_ini_contr)
      return !(data_ini_contr > endDate); 
    }
  }

  valido_bonus_renzi_data(){
     //se il modello è nuovo
     const endDate = new Date(2020,5,30);
     const data_ini_contr = new Date(this.items.data_ini_contr)
     return !(data_ini_contr > endDate); 
  }

  //1/7/2020 al 31/12/2020
  //se un contratto inizio fine si sovrappone con queste date visualizza
  valido_21_2020(){
    if (this.items.data_ini_contr){
      const validDate = new Date(2020,5,30);
      const data_ini_contr = new Date(this.items.data_ini_contr)
      const data_fine_contr = new Date(this.items.data_fine_contr)
      return data_ini_contr > validDate || (data_ini_contr < validDate && data_fine_contr > validDate);
    }else{
      return false;
    }
   
  }

}
