import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';

import { Updb4 } from './../../../classes/precontrattuale';
import { B4RapportoPA } from './../../../classes/b4rappPA';
import { B4RappPAService } from './../../../services/b4rappPA.service';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { takeUntil, tap } from 'rxjs/operators';
import { NgbStringAdapter } from 'src/app/NgbStringAdapter';

@Component({
  selector: 'app-b4-rapp-pa',
  templateUrl: './b4-rapp-pa.component.html',
  styleUrls: ['./b4-rapp-pa.component.css']
})
export class B4RappPaComponent extends BaseComponent {

  // accesso in html di proprietà non dichiarate
  items: any; // B4RapportoPA;
  private precontr: Updb4;
  idins: number;
  update: boolean = true;
  adapter = new NgbStringAdapter();      
  
  rapps: Array<Object> = [
    {rapp: 'TIND', name: this.translateService.instant('b4_txt2')},
    {rapp: 'TDET', name: this.translateService.instant('b4_txt3')},
    {rapp: 'ASP', name: this.translateService.instant('b4_txt4')}
  ];

  times: Array<Object> = [
    {time: 1, name: 'pieno'},
    {time: 0, name: 'parziale'}
  ];

  formAttch = new FormGroup({});
  model: any = {
    attachments: [
      {
        attachmenttype_codice: 'AUT_PA',
      },
    ]
  };

  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fieldsPubbAmm: FormlyFieldConfig[] = [
    {                    
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'percentuale',
          type: 'input',
          className: 'col-md-4',
          templateOptions: {
            label: 'Percentuale',
            required: true,
            placeholder: '. . . %',
            minLength: 1,
            maxLength: 3,
            pattern: /^[0-9]{1,3}$/,
            description: 'Percentuale di lavoro presso la Pubblica Amministrazione'
          },
          hideExpression: (model: any, formState: any) => {
            if (this.model.tempo_pieno || this.model.tipo_rapporto === 'ASP') {
              return true;
            }
            return false;
          },
          expressionProperties: {
            'model.percentuale': (model: any, formState: any, field: FormlyFieldConfig) => field.templateOptions.hidden ? null : model.percentuale,
          }
        },
        {
          key: 'dal_giorno',
          type: 'date',
          className: 'col-md-4',
          templateOptions: {
            label: 'dal giorno',
            required: true,
          },
          hideExpression: (model: any, formState: any) => {
            if (this.model.tipo_rapporto !== 'TDET' && this.model.tipo_rapporto !== 'ASP') {
              return true;
            }
            return false;
          },
          hooks: {
            onInit: (field) => {
              const form = field.formControl;
              field.formControl.valueChanges.pipe(
                takeUntil(this.onDestroy$),
                tap(val => {      
                  if (field.formControl.valid){
                    let al_giorno = field.parent.fieldGroup.find(x => x.key == 'al_giorno');
                    al_giorno.templateOptions.datepickerOptions.minDate = this.adapter.fromModel(val); 
                    this.cdr.detectChanges();       
                    //console.warn(field,field.formControl.valid, val)
                  }                                       
                }),
              ).subscribe();
            },
          }  
        },
        {
          key: 'al_giorno',
          type: 'date',
          className: 'col-md-4',
          templateOptions: {
            label: 'al giorno',
            required: true,
            // minDate: this.model.dal_giorno
          },
          hideExpression: (model: any, formState: any) => {
            if (this.model.tipo_rapporto !== 'TDET') {
              return true;
            }
            return false;
          },
        },
      ]
    },
    
    // DATI DELLA P.A.
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'denominazione_pa',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            required: true,
            translate: true,
            label: 'b4_txt10'
          }
        },
        {
          key: 'cod_fisc_pa',
          type: 'input',
          className: 'col-md-3',
          validation: {
            show: true
          },
          templateOptions: {
            required: true,
            translate: true,
            label: 'b4_txt11',
            minLength: 11,
            maxLength: 16
          }
        },
        {
          key: 'piva_pa',
          type: 'input',
          className: 'col-md-3',
          validation: {
            show: true
          },
          templateOptions: {
            required: true,
            translate: true,
            label: 'b4_txt12',
            minLength: 11,
            maxLength: 11
          }
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'indirizzo_pa',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            required: true,
            translate: true,
            label: 'b4_txt13'
          }
        },
        {
          key: 'num_civico_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'b4_txt14'
          }
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'comune_pa',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            required: true,
            translate: true,
            label: 'b4_txt15'
          }
        },
        {
          key: 'provincia_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            required: true,
            translate: true,
            description: 'Richiesti due caratteri maiuscoli',
            label: 'b4_txt16',
            minLength: 2,
            maxLength: 2,
            pattern: /^[A-Z]{2}$/
          }
        },
        {
          key: 'cap_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            required: true,
            translate: true,
            label: 'b4_txt17',
            minLength: 5,
            maxLength: 5,
            pattern: /^[0-9]{5}$/
          }
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'num_telefono_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'b4_txt18',
            maxLength: 20,
          }
        },
        {
          key: 'num_fax_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'b4_txt19',
            maxLength: 20,
          }
        },
        {
          key: 'email_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'b4_txt20',
            pattern:  /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            maxLength: 100,
          }
        },
        {
          key: 'pec_pa',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            translate: true,
            label: 'b4_txt21',
            pattern: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            maxLength: 100,
          }
        }
      ]
    }
  ];

  //attività professionale
  fields2: FormlyFieldConfig[] = [    
    {
      fieldGroup: [
        {
          template: '<p>' + this.translateService.instant('b4_txt6') + '</p>'
        }
      ]
    },
    {
      key: 'attivita_professionale',
      type: 'checkbox',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: 'b4_txt7'
      }
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'descrizione_attivita',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            label: 'attività professionale',
            required: true,
            placeholder: '. . .',
            maxLength: 190,
          },
          hideExpression: (model: any, formState: any) => {
            return !model.attivita_professionale;
          },
        }
      ]
    },
    {
      key: 'iscrizione_albo',
      type: 'checkbox',
      defaultValue: false,
      templateOptions: {
        label: ''
      },
      expressionProperties: {
        'templateOptions.label': () => this.translateService.instant('b4_txt8', { s: ControlUtils.genderTranslate(this.items.sesso) }), 
      }
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'descrizione_albo',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            label: 'albo professionale',
            required: true,
            placeholder: '. . .',
            maxLength: 190,
          },
          hideExpression: (model: any, formState: any) => {
            return !model.iscrizione_albo;
          },
        }
      ]
    }
  ];

  // Allegati
  fields3: FormlyFieldConfig[] = [
    {
      key: 'attachments',
      type: 'repeat',
      templateOptions: {
        min: 1,
        btnHidden: true,
        btnRemoveHidden: true,
      },
      fieldArray: {
        fieldGroup: [
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              // attachmenttype_codice
              {
                key: 'attachmenttype_codice',
                type: 'input',
                defaultValue: 'AUT_PA',
               
                templateOptions: {
                  type: 'hidden',
                  //label: 'Tipo documento',
                }
              },
              // filename
              {
                // NB è stato richiesto in fase di validazione di poter inserire dei
                // riferimenti ad degli allegati ma senza includere il file
                key: 'filename',
                type: 'fileinput',
                className: 'col-md-6',
                templateOptions: {
                  translate: true,
                  label: 'b4_txt27',
                  type: 'input',
                  description: 'N.B. Il documento da caricare deve essere in formato PDF',
                  placeholder: 'Carica il documento . . .',
                  accept: 'application/pdf',
                  maxLength: 255,
                  onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
                },
              },
              // bottoni azione
              {
                fieldGroupClassName: 'btn-toolbar',
                className: 'col-md-2 btn-group',
                fieldGroup: [
                  {
                    type: 'button',
                    className: 'mt-4 pt-2',
                    templateOptions: {
                      btnType: 'primary oi oi-data-transfer-download',
                      title: 'Scarica il documento',
                      // icon: 'oi oi-data-transfer-download'
                      onClick: ($event, model, field) => this.download($event, model),
                    },
                    hideExpression: (model: any, formState: any) => {
                      return !model.id;
                    },
                  },
                ],
              },
            ],
          },
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                key: 'filevalue',
                type: 'input',
                templateOptions: {
                  type: 'hidden'        
                },
              },
              {
                key: 'id',
                type: 'input',
                templateOptions: {
                  type: 'hidden'        
                },
              },
            ],
          },               
          ],
        },
      },
  ];

  fields: FormlyFieldConfig[] = [
    {
      //wrappers: ['riquadro'], 
      fieldGroup: [
          //scelta tempo pieno o parziale
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                key: 'tipo_rapporto',
                type: 'select',
                defaultValue: 'TIND',
                className: 'col-md-6',
                templateOptions: {
                  options: this.rapps,
                  valueProp: 'rapp',
                  labelProp: 'name',
                  translate: true,
                  label: 'b4_txt1'
                }
              },
              {
                key: 'tempo_pieno',
                type: 'select',
                defaultValue: 1,
                className: 'col-md-3',
                templateOptions: {
                  options: this.times,
                  valueProp: 'time',
                  labelProp: 'name',
                  translate: true,
                  label: 'b4_txt5',
                  required: true,
                },
                hideExpression: (model: any, formState: any) => {
                  if (this.model && this.model.tipo_rapporto === 'ASP') {
                    return model;
                  }
                  return false;
                },
              },    
            ],
          },  
          {
            fieldGroup: [
              {
                template: '<h5>' + this.translateService.instant('b4_int_pa') + '</h5>'
              }
            ]
          },
          // elenco Pubbliche Amministrazioni
          {
            fieldGroupClassName: 'row justify-content-end',
            className: 'col-md-12',
            fieldGroup: [
              {
                key: 'pubblamm',
                type: 'repeat',
                className: 'col-md-12',
                validation: {
                  show: true
                },
                templateOptions: {
                  // label: 'Elenco Pubbliche Amministrazioni',
                  min: 1,
                  max: 4,
                  template: '<hr></hr>',
                },
                expressionProperties: {
                  'templateOptions.max': () => (this.model.tempo_pieno || this.model.tipo_rapporto === 'ASP') ? 1 : 4,
                },
                validators: {
                  atleastone: {
                    expression: (c) => {
                      if (c.value) {
                        if (c.value.length < 1) {
                          return false;
                        }
                      } else {
                        return false;
                      }
                      return true;
                    },
                    message: (error, field: FormlyFieldConfig) => `Inserire almeno un rapporto di lavoro con la Pubblica Amministrazione`,
                  },
                  tempopieno: {
                    expression: (c) => {
                      if (c.value && (this.model.tempo_pieno || this.model.tipo_rapporto === 'ASP')) {
                        if (c.value.length > 1) {
                          return false;
                        }
                      } 
                      return true;
                    },
                    message: (error, field: FormlyFieldConfig) => `Regime di lavoro a tempo pieno inserire un solo rapporto di lavoro con Pubblica Amministrazione`,
                  }
                },
                fieldArray: {
                  fieldGroup: this.fieldsPubbAmm,
                }
              },
            ],
          },
      ]},

  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private rapportoPAService: B4RappPAService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,              
              public tools: InsegnamTools,
              private cdr: ChangeDetectorRef) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
  
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.rapportoPAService.getPrecontr(+params.get('id')).subscribe(
            response => {
                          
              // se esiste una copia locale utilizzo quella
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {              
                this.model = response['datiPrecontrattuale']['copy'];
                if (this.model.attachments && this.model.attachments.length === 0) {
                  this.model.attachments = [
                    { attachmenttype_codice: 'AUT_PA' }
                  ];
                }
              }
              // il parametro in ingresso è id insegnamento
              this.model.insegn_id = +params.get('id');
              this.idins = +params.get('id');

              this.items = response['datiPrecontrattuale'];
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.rapportoPAService.getRappPA(+params.get('id')).subscribe(
            response => {
              this.model = response['datiRapportoPA'];

              if (this.model.attachments && this.model.attachments.length === 0) {
                this.model.attachments = [
                  { attachmenttype_codice: 'AUT_PA' }
                ];
              }
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idB4: number) {
    this.isLoading = true;
    if (idB4 === 0) {

      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };

      this.newRappPA(preStore);
    } else {
      this.updateB4(this.model, idB4);
    }
  }

  newRappPA(pa: any) {
    this.rapportoPAService.newRappPA(pa).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro B.4: Rapporto di lavoro con la P.A. creato con successo');
          const data = response['datiRappPA'];         
          this.router.navigate(['home/rapppa/details', data.id]);
        } else {
          this.messageService.error(response['message']);
        }        
      }
    );
  }

  updateB4(rapppa: any, idB4: number) {
    this.rapportoPAService.updateRappPA(rapppa, idB4).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro B.4: Rapporto di lavoro con la P.A. aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }        
        this.router.navigate(['home/rapppa/details', idB4]);
      }
    );
  }

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig) {
    const currentAttachment = field.formControl.parent.value;
    if (currentSelFile == null) {
      // caso di cancellazione
      currentAttachment.filevalue = null;
      return;
    }

    this.isLoading = true;
    currentAttachment.model_type = 'user';

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      this.isLoading = true;
      // currentAttachment.filevalue = encode(e.target.result);
      field.formControl.parent.get('filevalue').setValue(encode(e.target.result));
      if (currentSelFile.name.search('pdf') > 0) {
        try {
          field.formControl.markAsDirty();
        } catch (error) {
          console.log(error);
          this.isLoading = false;
        }
      }

      if (!currentAttachment.filevalue) {
        this.isLoading = false;
        return;
      }
      this.isLoading = false;
    };
    reader.readAsArrayBuffer(currentSelFile);
  }

  download(event, model) {
    // implementare api
    this.rapportoPAService.download(model.id).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );
  }
}
