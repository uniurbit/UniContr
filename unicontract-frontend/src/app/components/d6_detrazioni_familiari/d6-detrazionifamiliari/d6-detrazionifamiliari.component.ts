import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdD6 } from './../../../classes/precontrattuale';
import { D6DetrazioniFamiliari } from './../../../classes/d6detrazioniFamiliari';
import { D6DetrazioniFamiliariService } from './../../../services/d6detrazioniFamiliari.service';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';

@Component({
    selector: 'app-d6-detrazionifamiliari',
    templateUrl: './d6-detrazionifamiliari.component.html',
    styleUrls: ['./d6-detrazionifamiliari.component.css'],
    standalone: false
})

export class D6DetrazionifamiliariComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdD6;
  idins: number;

  familiari: Array<Object> = [
    {familiare: 'F1', name: 'Primo figlio'},
    {familiare: 'F', name: 'Figlio successivo al primo'},
    {familiare: 'A', name: 'Altro familiare'}
  ];

  formAttch = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fieldsParentela: FormlyFieldConfig[] = [
    // RELAZIONI DI PARENTELA
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // PARENTELA
        {
          key: 'parentela',
          type: 'select',
          className: 'col-md-4',
          props: {
            options: this.familiari,
            valueProp: 'familiare',
            labelProp: 'name',
            translate: true,
            label: 'd6_label2',
            required: true,
          }
        },
        // nome
        {
          key: 'nome',
          type: 'input',
          className: 'col-md-4',
          props: {
            required: true,
            translate: true,
            label: 'd6_nome'
          }
        },
        // cognome
        {
          key: 'cognome',
          type: 'input',
          className: 'col-md-4',
          props: {
            required: true,
            translate: true,
            label: 'd6_cognome'
          }
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // Codica fiscale
        {
          key: 'cod_fiscale',
          type: 'input',
          className: 'col-md-3',
          props: {
            minLength: 16,
            maxLength: 16,
            required: true,
            translate: true,
            label: 'd6_label3',
            pattern: /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/
          }
        },
        // data di nascita
        {
          key: 'data_nascita',
          type: 'date',
          className: 'col-md-3',
          props: {
            required: true,
            translate: true,
            label: 'd6_label4'
          },
        },
        // Disabilità
        {
          type: 'select',
          key: 'flag_disabilita',
          className: 'col-md-3',
          defaultValue: 0,
          props: {
            translate: true,
            label: 'd6_label6',
            options: [
              {value: 0, label: 'No'},
              {value: 1, label: 'Sì'}
            ]
          },
        },
        // percentuale detrazione
        {
          key: 'percentuale_detrazione',
          type: 'input',
          className: 'col-md-3',
          props: {
            maxLength: 3,
            required: true,
            translate: true,
            label: 'd6_label5'
          }
        },
      ]
    }
  ];

  //deve essere abilitato solo se nel riquadro d4 flag_detrazioni è true 
  fields: FormlyFieldConfig[] = [
    {
      template: '<h5>' + this.translateService.instant('d6_intest') + '</h5>',
    },
    {
      //fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_richiesta_detrazioni',
          //className: 'custom-switch ps-4 pe-2 pt-1',
          defaultValue: false,
          validation: {
            show: true,
          }, 
          props: {
            formCheck: 'switch',
            change: (field, $event) => {
              if (field.model.flag_richiesta_detrazioni === false || field.model.flag_richiesta_detrazioni === 0) {
                this.model.flag_coniuge_carico = false;
                this.model.dal_giorno = null;
              }
            }
          },
          expressionProperties: {
            'props.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_richiesta_detrazioni === false || model.flag_richiesta_detrazioni === 0) {
                return 'NO '+ this.translateService.instant('d6_intest2');
              } else {
                return 'SÌ '+ this.translateService.instant('d6_intest2');
              }
            }
            // 'props.disabled': (model: any, formState: any, field: FormlyFieldConfig) => {
            //   if (this.items.flag_detrazioni == 0 || this.items.flag_detrazioni == false)
            //     return true;
                
            //   return false;              
            // }
          },
            //validazione 
          validators: {
            compatibility_detr6: { 
              expression: ctrl => {
                //il valore è vero
                // e la richiesta detrazioni è falsa
                if (ctrl.value && (this.items.flag_detrazioni == 0 || this.items.flag_detrazioni == false))
                  return false;
                return true;
              },
              message: (error, field: FormlyFieldConfig) => {
                return 'Scelta non compatibile con riquadro D4 "'+this.translateService.instant('d4_intest2')+'" a NO'    
             }
            }
          },
        },
      ]
    },
    //coniuge
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'flag_coniuge_carico',
          type: 'checkbox',
          defaultValue: false,
          className: 'col-md-10',
          props: {
            translate: true,
            label: 'd6_txt1',
          },
          hideExpression: (model, formstate) => {
            return (!this.model.flag_richiesta_detrazioni);
          }
        },
      ],
    },

    //dal_giorno
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'dal_giorno',
          type: 'date',
          className: 'col-md-6',
          props: {
            required: true,
            translate: true,
            label: 'd6_label1',
          },
          hideExpression: (model, formstate) => {
            return (!this.model.flag_coniuge_carico || !this.model.flag_richiesta_detrazioni );
          }
        },
      ],
     
    },

    // ELENCO FAMILIARI
    {
      fieldGroupClassName: 'row justify-content-end',
      className: 'col-md-12',
      fieldGroup: [
        {
          key: 'familiari',
          type: 'repeat',
          className: 'col-md-12',
          validation: {
            show: true
          },
          props: {
            translate: true,
            label: 'd6_label7',
            min: 0,
            max: 12,
            template: '<hr></hr>',
          },
          fieldArray: {
            fieldGroup: this.fieldsParentela,
          },
          hideExpression: (model, formstate) => {
            return (!this.model.flag_richiesta_detrazioni);
          }
        },
      ],
    },
    //nota 
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
      {
        //Modifiche _2022 dovute alla modifica delle aliquote fiscali Legge bilancio 2022
        template: "<p>Dal 01/03/2022, in seguito all'introduzione dell'Assegno Unico Universale (AUU), le detrazioni per figli a carico possono essere richieste solo per figli oltre i 21 anni di età.</p>",        
        className: 'col-auto',
        hideExpression: (model, formstate) => {
          return (!this.model.flag_richiesta_detrazioni);
        }
      }
      ]
    },

  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d6Service: D6DetrazioniFamiliariService,
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
          this.d6Service.getPrecontr(+params.get('id')).subscribe(
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
          this.d6Service.getDatiDetrazioni(+params.get('id')).subscribe(
            response => {
              this.model = response['datiFamiliari'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idD6: number) {
    this.isLoading = true;
    if (idD6 === 0) {
      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      this.newDetrazioni(preStore);
    } else {
      this.updateD6(this.model, idD6);
    }
  }

  newDetrazioni(fiscali: any) {
    this.d6Service.newDatiDetrazioni(fiscali).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiFamiliari']['id']; // RETURN LAST ID
        
        if (response['success']) {
          this.messageService.info('Modello D.6: Richiesta detrazioni fiscali per familiari a carico creato con successo');
          const data = response['datiFamiliari'];
          this.router.navigate(['home/familiari/details',  data.id ]);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

  updateD6(fiscali: any, idD6: number) {
    this.d6Service.updateDatiDetrazioni(fiscali, idD6).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.6: Richiesta detrazioni fiscali per familiari a carico aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/familiari/details', idD6]);
      }
    );
  }

}
