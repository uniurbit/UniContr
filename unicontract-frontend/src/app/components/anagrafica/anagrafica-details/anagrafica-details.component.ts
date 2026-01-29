import { InsegnamTools } from './../../../classes/insegnamTools';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Anagrafica } from './../../../classes/anagrafica';
import { AnagraficaLocal } from './../../../classes/anagrafica-local';
import { AnagraficaService } from './../../../services/anagrafica.service';
import { AnagraficaLocalService } from './../../../services/anagrafica-local.service';
import { MessageService, BaseComponent } from './../../../shared';
import { Precontrattuale } from './../../../classes/precontrattuale';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { Upda1 } from './../../../classes/precontrattuale';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { UntypedFormGroup } from '@angular/forms';
import { ConfirmationDialogService } from './../../../shared/confirmation-dialog/confirmation-dialog.service';
import { TranslateService } from '@ngx-translate/core';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { TranslateSelectPipe } from 'src/app/shared/pipe/translate-select.pipe';
import { StoryProcess } from './../../../classes/storyProcess';
import { StoryProcessService } from './../../../services/storyProcess.service';
import { saveAs } from 'file-saver';



export const tipotitoli: string[] = [
  'BP',
  'A1',
  'A2',
  'DA',
  'S', 
  'DS',
  'DU',
  'DR',
  'MT',
  'TU',
  'EE',
  'MS',
  'LM',
  'LS',
  'L', 
  'LA',
  'M1',
  'M2',
  'SS', //SI SM SL SB SC SD
  'PQ',
  'P', 
  'SP'
];


@Component({
    selector: 'app-anagrafica-details',
    templateUrl: './anagrafica-details.component.html',
    styleUrls: ['./anagrafica-details.component.css'],
    standalone: false
})

export class AnagraficaDetailsComponent extends BaseComponent {

  title1 = '';
  title2 = 'DOCUMENTAZIONE ALLEGATA';

 
 

  originalValue: any; // solo in stato nuovo
  resp: Anagrafica;
  item: AnagraficaLocal = null;

  private precontr: Upda1;
  idins: number;
  p2id: number;
  story: StoryProcess;

  translationSelect = new TranslateSelectPipe();

  model: any = {
    attachments: [
      {
        attachmenttype_codice: 'DOC_CV',
      },
      // inserimento CI commentato su richiesta
      // {
      //   attachmenttype_codice: 'DOC_CI',
      // }
    ]
  };

  optionsAnagrafica: FormlyFormOptions = {
    formState: {
      model: this.item,
      isLoading: this.isLoading,
    },
  };
  formAnagrafica =  new UntypedFormGroup({});
  fieldsAnagrafica: FormlyFieldConfig[] = [
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title1')
      },
      fieldGroup: [
        // nascita luogo e data stato civile
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'comune_nascita',
              type: 'input',
              className: 'col-md-6',
              props: {
                required: true,
                translate: true,
                label: 'a1_label1',
                maxLength: 190,
              },
            },
            {
              key: 'provincia_nascita',
              type: 'provincia',
              className: 'col-md-6',
              props: {
                maxLength: 2,
                required: true,
                translate: true,
                label: 'a1_label2',
                description: "Inserire EE per comune nascita all'estero"
              },
            },
            {
              key: 'data_nascita',
              type: 'date',
              className: 'col-md-6',
              props: {
                required: true,
                translate: true,
                label: 'a1_label3'
              },
            },
            {
              key: 'stato_civile',
              type: 'select',
              className: 'col-md-6',
              validation: {
                show: true,
              },
              props: {
                required: true,
                options: [],
                translate: true,
                label: 'a1_label4'
              },
              validators: {
                non: {
                  expression: (c) => (c.value !== '0' && c.value !== 'O'),
                  message: (error, field) => `Il valore "${ this.translateService.instant('O_nonassegnato') }" non è ammissibile `,
                }
              },
            },
          ],
        },
        // codice fiscale coniuge
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'cf',
              type: 'input',
              className: 'col-md-6',
              props: {
                readonly: true,
                required: true,
                translate: true,
                label: 'a1_label5',
                pattern: /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/
              },
            },
            {
              key: 'cf_coniuge',
              type: 'input',
              className: 'col-md-6',
              props: {
                minLength: 2,
                maxLength: 16,
                required: true,
                translate: true,
                label: 'a1_label6',
                pattern: /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]|[E]{2}|[0-9]{9}$/,
                description: "Inserire EE per codici fiscali esteri"
              },
              expressionProperties: {
                'props.required': (model: any, formState: any, field: FormlyFieldConfig) => {
                  return (model.stato_civile === 'C' || model.stato_civile === 'Z');
                },
                'props.disabled': (model: any, formState: any, field: FormlyFieldConfig) => {
                  return (model.stato_civile !== 'C' && model.stato_civile !== 'Z');
                },
              }
            },
          ]
        },
        // nazionalità e titolo di studio
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'nazione_residenza',
              type: 'input',
              className: 'col-md-6',
              props: {
                required: true,
                translate: true,
                label: 'a1_label7',
                maxLength: 255
              },
            },
            {
              key: 'titolo_studio',
              type: 'select',
              className: 'col-md-6',
              validation: {
                show: true,
              },
              props: {
                options: tipotitoli.map( x => {
                  return { key: x, name: this.translateService.instant('TITOLO.'+x) }
                }),
                valueProp: 'key',
                labelProp: 'name',
                translate: true,
                label: 'a1_label8',
                required: true,
              },
              validators: {
                non: {
                  expression: (c) => (tipotitoli.includes(c.value)),
                  message: (error, field) => `Campo richiesto`,
                }
              },
            }
          ]
        },
      ],
    },
    // resisenza
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title2')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // comune
            {
              key: 'comune_residenza',
              type: 'input',
              className: 'col-md-6',
              name: 'city ',
              props: {
                required: true,
                translate: true,
                label: 'a1_label9',
                maxLength: 190,
              },
            },
            // provincia
            {
              key: 'provincia_residenza',
              type: 'provincia',
              className: 'col-md-3',              
              props: {                              
                maxLength: 2,
                required: true,
                translate: true,
                label: 'a1_label10',
                description: "Inserire EE per residenze all'estero"
              },
            },
            // cap
            {
              key: 'cap_residenza',
              type: 'input',
              className: 'col-md-3',
              name: 'postal-code',
              props: {
                maxLength: 5,
                required: true,
                translate: true,
                label: 'a1_label11'
              },
            },
          ]
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // indirizzo
            {
              key: 'indirizzo_residenza',
              type: 'input',
              className: 'col-md-6',
              props: {
                required: true,
                translate: true,
                label: 'a1_label12',
                maxLength: 190,
              },
            },
            // civico
            {
              key: 'civico_residenza',
              type: 'input',
              className: 'col-md-3',
              props: {
                required: true,
                maxLength: 10,
                translate: true,
                label: 'a1_num_civico',
                //pattern: /^[1-9]\d*(?: ?(?:[a-z][a-z]?|[/-] ?\d+[a-z]?[a-z]?|[/-] ?[a-z]?[a-z]?))?$/i
                //pattern: /^(SNC)|[1-9]\d*(?: ?(?:[a-z][a-z]?|[/-] ?\d+[a-z]?[a-z]?|[/-] ?[a-z]?[a-z]?))?$/i
                pattern: /^([0-9a-zA-Z \-])*/i
              },
            },
            // data variazione indirizzo di residenza
            {
              key: 'data_variazione_residenza',
              type: 'date',
              className: 'col-md-3',
              props: {
                translate: true,
                label: 'data_variazione_dom_fisc'
              },
            },
          ]
        },
      ],
    },
    // residenza fiscale
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title3')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // comune
            {
              key: 'comune_fiscale',
              type: 'input',
              className: 'col-md-6',
              props: {
                required: true,
                translate: true,
                label: 'a1_label9',
                maxLength: 190,
              },
            },
            // provincia
            {
              key: 'provincia_fiscale',
              type: 'provincia',
              className: 'col-md-3',              
              props: {
                attributes: {
                  autocomplete: 'fiscale',
                },
                maxLength: 2,
                required: true,
                translate: true,
                label: 'a1_label10',
                description: "Inserire EE per residenza fiscale all'estero"
              },
            },
            // cap
            {
              key: 'cap_fiscale',
              type: 'input',
              className: 'col-md-3',
              props: {                
                attributes: {
                  autocomplete: 'fiscale',
                },
                maxLength: 5,
                required: true,
                translate: true,
                label: 'a1_label11',
              },
            },
          ]
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // indirizzo
            {
              key: 'indirizzo_fiscale',
              type: 'input',
              className: 'col-md-6',
              props: {
                attributes: {
                  autocomplete: 'fiscale',
                },
                required: true,
                translate: true,
                label: 'a1_label12',
                maxLength: 190,
              },
            },
            // civico
            {
              key: 'civico_fiscale',
              type: 'input',
              className: 'col-md-3',
              props: {
                required: true,
                maxLength: 10,
                translate: true,
                label: 'a1_num_civico',
                //pattern: /^[1-9]\d*(?: ?(?:[a-z][a-z]?|[/-] ?\d+[a-z]?[a-z]?|[/-] ?[a-z]?[a-z]?))?$/i
                //pattern: /^(SNC)|[1-9]\d*(?: ?(?:[a-z][a-z]?|[/-] ?\d+[a-z]?[a-z]?|[/-] ?[a-z]?[a-z]?))?$/i                
                pattern: /^([0-9a-zA-Z \-])*/i
              },
            },
            // data variazione del residenza fiscale
            {
              key: 'data_variazione_dom_fiscale',
              type: 'date',
              className: 'col-md-3',
              props: {
                translate: true,
                label: 'data_variazione_dom_fisc'
              },
            },
          ]
        },
      ],
    },

    // domicilio per comunicazioni
    /*
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title7')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // comune
            {
              key: 'comune_comunicazioni',
              type: 'input',
              className: 'col-md-6',
              props: {
                translate: true,
                label: 'a1_label9',
              },
            },
            // provincia
            {
              key: 'provincia_comunicazioni',
              type: 'input',
              className: 'col-md-3',
              props: {
                maxLength: 2,
                translate: true,
                label: 'a1_label10',
              },
            },
            // cap
            {
              key: 'cap_comunicazioni',
              type: 'input',
              className: 'col-md-3',
              props: {
                maxLength: 5,
                translate: true,
                label: 'a1_label11',
              },
            },
          ]
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // indirizzo
            {
              key: 'indirizzo_comunicazioni',
              type: 'input',
              className: 'col-md-6',
              props: {
                translate: true,
                label: 'a1_label12',
              },
            },
            // civico
            {
              key: 'civico_comunicazioni',
              type: 'input',
              className: 'col-md-3',
              props: {
                maxLength: 10,
                translate: true,
                label: 'a1_label13',
              },
            }
          ]
        },
      ],
    },
    */
    // recapito telefonico
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title4')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // cellulare
            {
              key: 'telefono_cellulare', // 'tel_rif',
              type: 'input',
              className: 'col-md-6',
              name: 'mobile',
              props: {
                maxLength: 20,
                required: true,
                translate: true,
                label: 'a1_label14'
              },
            },
            // Abitazione
            {
              key: 'telefono_abitazione', // 'tel_res',
              type: 'input',
              className: 'col-md-6',             
              props: {
                attributes: {
                  autocomplete: 'abitazione',
                },
                maxLength: 20,
                translate: true,
                label: 'a1_label15'
              },
            },
          ]
        },
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // interno
            {
              key: 'telefono_ufficio', // 'tel_interno',
              type: 'input',
              className: 'col-md-6',
              name: 'phone',
              props: {
                attributes: {
                  autocomplete: 'ufficio',
                },
                maxLength: 60,
                translate: true,
                label: 'a1_label16'
              },
            },
          ]
        }

      ],
    },
    // indirizzo email
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title5')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'email',
              type: 'input',
              className: 'col-md-6',
              props: {
                required: true,
                translate: true,
                label: 'a1_label17',
                maxLength: 190,
              },
              expressionProperties: {
                'props.readonly': (model: any, formState: any, field: FormlyFieldConfig) => {
                  return (model.email !== '*@uniurb.it');
                },
              }
            },
            {
              key: 'email_privata', // 'e_mail_privata',
              type: 'input',
              className: 'col-md-6',
              props: {
                translate: true,
                label: 'a1_label18',
                maxLength: 190,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              },
            },
          ]
        }
      ]
    },
    // tutela lavoratrici madri
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title8')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'flag_lavoratrici_madri',
              type: 'checkbox',             
              className: 'col-auto',
              defaultValue: false,             
              
              props: {
                indeterminate: false,
                required: true,                
                translate: true,
                label: 'a1_label24'
              },
              validators: {
                flag_true: {
                  expression: ctrl => ctrl.value ? true : false,
               }
               
              },
            },
          ]
        },
        {
          template: '<span class="form-text">La documentazione e la normativa vigente sono dispobili presso <a href="https://www.uniurb.it/ateneo/utilita/salute-e-sicurezza/informazione-ai-lavoratori" target="_blank">https://www.uniurb.it/ateneo/utilita/salute-e-sicurezza/informazione-ai-lavoratori </a></span>',
          className: 'pb-1'
        }
       
      ],
      hideExpression: (model: any, formState: any) => {
        if (!(model.sesso === 'F')) {
          return true;
        }
        return false;
      },
    },
    // allegati
    {
      wrappers: ['riquadro'],
      props: {
        title: this.translateService.instant('a1_title6')
      },
      fieldGroup: [
        {
          key: 'attachments',
          type: 'repeat',
          props: {
            translate: true,
            label: 'a1_label19',
            min: 0,
            max: 2,
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
                  defaultValue: 'DOC_CV',
                  props: {
                    type: 'hidden',
                    options: [
                      { codice: 'DOC_CV', descrizione: 'Curriculum' },
                      { codice: 'DOC_CI', descrizione: 'Carta di identità' },
                    ],
                    valueProp: 'codice',
                    labelProp: 'descrizione',
                  }
                },
                // filename
                {
                  // NB è stato richiesto in fase di validazione di poter inserire dei
                  // riferimenti ad degli allegati ma senza includere il file
                  key: 'filename',
                  type: 'fileinput',
                  className: 'col-md-6',
                  validation: {
                    show: true
                  },
                  props: {
                    label: 'Curriculum Vitae',
                    type: 'input',
                    readonly: true,
                    placeholder: 'Carica il documento . . . ',
                    description: 'N.B. Il Curriculum Vitae da caricare deve essere in formato PDF e privo di dati sensibili. Dimensione massima 5MB.',
                    accept: 'application/pdf',
                    maxLength: 255,
                    required: true,
                    onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
                  },
                  validators: {
                    maxsize: {
                      expression: (c,f) => (f.model._filesize && f.model._filesize > 5720000 ) ? false : true, //2720000
                      message: (error, field) => `La dimensione del file eccede la dimensione massima consentita `,
                    },
                    filetype: {
                      expression: (c,f) => (c.value ? (c.value.endsWith('.pdf') ? true : false) :true),
                      message: (error, field) => `Il formato file richiesto è PDF`,
                    }

                  },
                },

                // bottoni azione
                {
                  fieldGroupClassName:  'btn-toolbar',
                  className: 'col-md-2 btn-group',
                  fieldGroup: [
                    {
                      type: 'button',
                      className: 'mt-4 pt-2',
                      props: {
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
                    props: {
                      type: 'hidden'        
                    },
                  },
                  {
                    key: 'id',
                    type: 'input',
                    props: {
                      type: 'hidden'        
                    },
                  },
                ],
              },
            ],
          },
        },
      ]
    }

       
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private anagraficaService: AnagraficaService,
              private anagraficaLocalService: AnagraficaLocalService,
              private precontrattualeService: PrecontrattualeService,
              private storyService: StoryProcessService,
              public messageService: MessageService,
              public confirmationDialogService: ConfirmationDialogService,
              protected translateService: TranslateService,
              private tools: InsegnamTools) {

    super(messageService);
  }

  mapping(dati) {
  }

  setMetada(metadata) {
    //stato_civile ritorna { key: string, value: string }
    ControlUtils.getField('stato_civile', this.fieldsAnagrafica).props.options = metadata.stato_civile.map(item => ({
      label: item.value,
      value: item.key
    }));
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.messageService.clear();
    this.isLoading = true;
    this.route.paramMap.subscribe(
      (params) => {
        if (params.get('upd')) {
          // this.update = true;
          this.isLoading = true;
          this.anagraficaLocalService.getAnagraficaLocal(params.get('id_ab')).subscribe(
            response => {
              this.isLoading = false;
              this.setMetada(response['datiAnagrafica']['metadata']);
              this.item = response['datiAnagrafica'];
              this.resp = response['datiAnagrafica'];
              if (!this.item['attachments'] || this.item['attachments'].length === 0) {
                // se non ci sono allegati
                this.item['attachments'] =  [
                  {
                    attachmenttype_codice: 'DOC_CV',
                  },
                ];
              }
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.update = false;
          // UGOV
          // this.isLoading = true;
          this.anagraficaService.getAnagrafica(params.get('id_ab')).subscribe(
            response => {
              this.isLoading = false;
              this.setMetada(response['dati']['metadata']);
              // se esiste una copia locale utilizzo quella
              let copy = response['dati']['copy'];
              if (copy) {
                this.resp = response['dati'];
                this.item = response['dati']['copy'];
                this.originalValue = JSON.parse(JSON.stringify(response['dati']['copy']));
                // Object.keys(copy).forEach(key=>this.item[key]=copy[key]);
              } else {
                // valori che arrivano da ugov
                this.resp = response['dati'];
                this.item = Anagrafica.toLocalAnagrafica(this.resp);
                this.originalValue = Anagrafica.toLocalAnagrafica(this.resp);
              }

              console.log(this.item);
              this.item['attachments'] = response['dati']['attachments'];

              if (!this.item['attachments'] || this.item['attachments'].length === 0) {
                // se non ci sono allegati
                this.item['attachments'] =  [
                  {
                    attachmenttype_codice: 'DOC_CV',
                  },
                  // {
                  //   attachmenttype_codice: 'DOC_CI',
                  // }
                ];
              }
              this.idins = +params.get('idins');
              this.p2id = +params.get('p2id');
              this.onValidate();
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  ngAfterViewInit() {
    this.formAnagrafica.updateValueAndValidity();
 }

  saveAnagr(data, idA1: number) {
   if (!idA1) {
      data['attachments'] = this.item['attachments'];
      if (this.resp) {
        data.sesso = this.resp.sesso;
        data.nazione_nascita = this.resp.naz_nasc;
        data['id_ab'] = this.resp.id_ab;
      } else {
        data.sesso = this.item.sesso;
        data.nazione_nascita = this.item.nazione_nascita;
        data['id_ab'] = this.item['id_ab'];
      }
      data['originalValue'] = this.originalValue;
      this.createAnagrafica(data);
    } else {
      this.updateA1(data, idA1);
    }
  }

  createAnagrafica(anagrafica: AnagraficaLocal) {
    anagrafica['insegn_id'] = this.idins;
    this.isLoading = true;
    this.anagraficaLocalService.newAnagraficaLocal(anagrafica).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          const lastid = response['datiAnagrafica']['id'];
          this.messageService.info('Quadro A.1: Dati anagrafici importati con successo');          
          this.router.navigate(['home/anagrafica/local', lastid]);
          // this.storyProcess('Modello A.1: Importazione dati anagrafici del collaboratore');
        } else {
          this.messageService.error(response['message']);
        }
        
      }
    );
  }

  updateA1(anagrafica: any, idA1: number) {
    this.isLoading = true;
    this.anagraficaLocalService.updateAnagraficaLocal(anagrafica, idA1).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro A.1: Dati anagrafici aggiornati con successo');
        } else {
          this.messageService.error(response['message']);
        }    
        this.router.navigate(['home/anagrafica/local', idA1]);
      }
    );
  }

  onSelectCurrentFile(currentSelFile, field: FormlyFieldConfig) {
    const currentAttachment = field.formControl.parent.value;
    if (currentSelFile == null) {
      // caso di cancellazione
      field.model._filesize = null;
      currentAttachment.filevalue = null;
      return;
    }
    field.model._filesize = currentSelFile.size;
    field.formControl.updateValueAndValidity();

    this.isLoading = true;
    currentAttachment.model_type = 'user';

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      this.isLoading = true;
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
    this.anagraficaLocalService.download(model.id).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );
  }

  remove(event, model) {
    this.confirmationDialogService.confirm('Conferma', 'Vuoi procedere con l\'operazione di elminazione?' )
      .then((confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          this.anagraficaLocalService.deleteFile(model.id).subscribe(
            prop => {
              this.isLoading = false;
              model.id = null;
              model.filename = null;
              model.uuid = null;
            },
            error => { // error path
              console.log(error);
              this.isLoading = false;
            }
          );
        }
        // console.log(confirmed);
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  public onValidate() {
    this.fieldsAnagrafica.forEach(f => ControlUtils.validate(f));
    this.formAnagrafica.markAsTouched();
  }

  storyProcess(description: string) {
    this.story = new StoryProcess();
    this.story.insegn_id = this.idins;
    this.story.descrizione = description;
    this.storyService.newStory(this.story).subscribe(
      response => {
        if (response['success']) {
          this.messageService.info('Storia del processo aggiornata con successo', false);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }
}
