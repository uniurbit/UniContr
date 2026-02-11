import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdD1 } from './../../../classes/precontrattuale';
import { D1Inps } from './../../../classes/d1inps';
import { D1InpsService } from './../../../services/d1inps.service';

import { FormGroup, UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { B6InformativaInterface } from 'src/app/interface/b6informativa.interface';

@Component({
    selector: 'app-d1-inps',
    templateUrl: './d1-inps.component.html',
    styleUrls: ['./d1-inps.component.css'],
    standalone: false
})

export class D1InpsComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdD1;
  idins: number;

  gestioni: Array<Object> = [
    { gestione: '', name: '' },
    { gestione: '002', name: '002 : Pensionati di tutti gli Enti pensionistici obbligatori', group: 'Pensionati' },
    { gestione: '101', name: '101 : Fondo Pensioni Lavoratori Dipendenti', group: 'INPS' },
    { gestione: '102', name: '102 : Artigiani', group: 'INPS' },
    { gestione: '103', name: '103 : Commercianti', group: 'INPS' },
    { gestione: '104', name: '104 : Coltivatori diretti, mezzadri e coloni', group: 'INPS' },
    { gestione: '105', name: '105 : Versamenti volontari', group: 'INPS' },
    { gestione: '106', name: '106 : Versamenti Figurativi (CIG, ecc...)', group: 'INPS' },
    { gestione: '107', name: '107 : Fondi speciali', group: 'INPS' },
    { gestione: '201', name: '201 : Dipendenti Enti Locali e Amministrazioni dello Stato', group: 'EX INPDAP' },
    { gestione: '301', name: '301 : Dottori commercialisti', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '302', name: '302 : Ragionieri', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '303', name: '303 : Ingegneri e Architetti', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '304', name: '304 : Geometri', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '305', name: '305 : Avvocati', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '306', name: '306 : Consulenti del lavoro', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '307', name: '307 : Notai', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '308', name: '308 : Medici', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '309', name: '309 : Farmacisti', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '310', name: '310 : Veterinari', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '311', name: '311 : Chimici', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '312', name: '312 : Agronomi', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '313', name: '313 : Geologi', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '314', name: '314 : Attuari', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '315', name: '315 : Infermieri professionali, Ass. sanitari, Vigilatrici infanzia', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '316', name: '316 : Psicologi', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '317', name: '317 : Biologi', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '318', name: '318 : Periti industriali', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '319', name: '319 : Agrotecnici, Periti agrari', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '320', name: '320 : Giornalisti (INPGI)', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '321', name: '321 : Spedizionieri', group: 'Casse Previdenziali Professionisti Autonomi' },
    { gestione: '401', name: '401 : Dirigenti d\'azienda', group: 'EX INPDAI' },
    { gestione: '501', name: '501 : Lavoratori dello spettacolo', group: 'ENPALS' },
    { gestione: '601', name: '601 : Lavoratori Poste Italiane S.p.A.', group: 'IPOST' }

  ];

  formAttch = new FormGroup({});
  model: any = {
    attachments: [
      {
        attachmenttype_codice: 'DOM_GS',
      },
    ]
  };
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields1: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_obbligo_contributivo',
          className: 'col',
          defaultValue: false,
          props: {
            formCheck: 'switch',
            change: (field, $event) => {
              if (field.model.flag_obbligo_contributivo === false || field.model.flag_obbligo_contributivo === 0) {
                //field.form.get('specif_obbligo_contributivo').setValue(null);
                this.model.specif_obbligo_contributivo = null;
              }
            }
          },
          expressionProperties: {
            'props.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_obbligo_contributivo === false || model.flag_obbligo_contributivo === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('d1_title2') + '</h5>',
          className: 'col-auto  pt-1'
        },
      ]
    },
    //specif_obbligo_contributivo
    {
      //fieldGroup: [
      //  {
      type: 'radio',
      key: 'specif_obbligo_contributivo',
      resetOnHide: true,
      props: {
        options: [
          { value: 'D1A', label: this.translateService.instant('d1_txt2') },
          { value: 'D1B', label: this.translateService.instant('d1_txt3') },
          { value: 'D1C', label: this.translateService.instant('d1_txt4') }
        ],
        required: true,
        translate: true,
        label: 'd1_txt1'
      },
      expressions: {
        hide: (field: any) => {
          if (field.model.flag_obbligo_contributivo === false || field.model.flag_obbligo_contributivo === 0) {
            return true;
          }
          return false;
        },
        'props.required': (field: FormlyFieldConfig) => {
          return !field.hide;
        }
      },
    }
  ];

  fields2: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_gestione_separata',
          className: 'col',
          defaultValue: false,
          props: {
            formCheck: 'switch',
            change: (field, $event) => {
              if (field.model.flag_gestione_separata === false || field.model.flag_gestione_separata === 0) {
                this.model.specif_gestione_separata = null;
              }
              field.form.updateValueAndValidity();
            }
          },
          expressionProperties: {
            'props.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_gestione_separata === false || model.flag_gestione_separata === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('d1_title3') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },
    {
      fieldGroup: [
        {
          type: 'radio',
          key: 'specif_gestione_separata',
          props: {
            options: [
              { value: 'D2A', label: this.translateService.instant('d1_txt6') },
              { value: 'D2B', label: this.translateService.instant('d1_txt7') }
            ],
            required: true,
            translate: true,
            label: 'd1_txt5'
          },
          expressions: {
            hide: (field: any) => {
              if (field.model.flag_gestione_separata === false || field.model.flag_gestione_separata === 0) {
                return true;
              }
              return false;
            },
            'props.required': (field: FormlyFieldConfig) => {
              return !field.hide;
            }
          },
        },
      ],

    }
  ];

  fields3: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_misura_ridotta',
          className: 'col',
          defaultValue: false,
          props: {
            formCheck: 'switch',
            change: (field, $event) => {
              if (field.model.flag_misura_ridotta === false || field.model.flag_misura_ridotta === 0) {
                this.model.specif_misura_ridotta = null;
                this.model.cassa_gestioni_previdenziali = null;
                this.model.data_pensione = null;
              }
              field.form.updateValueAndValidity();
            }
          },
          expressionProperties: {
            'props.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_misura_ridotta === false || model.flag_misura_ridotta === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('d1_title4') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },
    //specif_misura_ridotta
    {

      type: 'radio',
      key: 'specif_misura_ridotta',
      props: {
        options: [
          { value: 'D3A', label: this.translateService.instant('d1_txt9') },
          { value: 'D3B', label: this.translateService.instant('d1_txt11') },
          { value: 'D3C', label: this.translateService.instant('d1_txt13') },
        ],
        required: true,
        translate: true,
        label: 'd1_txt8'
      },
      expressions: {
        hide: (field: any) => {
          if (field.model.flag_misura_ridotta === false || field.model.flag_misura_ridotta === 0) {
            return true;
          }
          return false;
        },
        'props.required': (field: FormlyFieldConfig) => {
          return !field.hide;
        }
      },
    },
    //cassa_gestioni_previdenziali
    {
      fieldGroupClassName: 'row',
      //cassa_gestioni_previdenziali
      fieldGroup: [
        {
          key: 'cassa_gestioni_previdenziali',
          type: 'select',
          className: 'col-md-6',
          props: {
            options: this.gestioni,
            valueProp: 'gestione',
            labelProp: 'name',
            label: this.translateService.instant('d1_title5'),
            required: true,
          },
          expressions: {
            hide: (field: any) => {
              if (field.model.specif_misura_ridotta !== 'D3C' || field.model.flag_misura_ridotta === 0 || field.model.flag_misura_ridotta === false) {
                return true;
              }
              return false;
            },
            'props.required': (field: FormlyFieldConfig) => {
              return !field.hide;
            }
          },
        }
      ],

    },
    //data_pensione
    {
      fieldGroupClassName: 'row',
      //data_pensione
      fieldGroup: [
        {
          key: 'data_pensione',
          type: 'date',
          className: 'col-md-3',
          props: {
            translate: true,
            label: 'd1_txt16',
            required: true,
          },
          expressions: {
            hide: (field: any) => {
              if ((field.model.specif_misura_ridotta !== 'D3A' && field.model.specif_misura_ridotta !== 'D3B') || (field.model.flag_misura_ridotta === 0 || field.model.flag_misura_ridotta === false)) {
                return true;
              }
              return false;
            },
            'props.required': (field: FormlyFieldConfig) => {
              return !field.hide;
            }
          }
        },
      ],

    }
  ];

  fields4: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          type: 'checkbox',
          key: 'flag_partita_iva',
          className: 'col',
          defaultValue: false,
          props: {
            formCheck: 'switch',
          },
          expressionProperties: {
            'props.label': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_partita_iva === false || model.flag_partita_iva === 0) {
                return 'NO';
              } else {
                return 'SÌ';
              }
            }
          }
        },
        {
          template: '<h5>' + this.translateService.instant('d1_title6') + '</h5>',
          className: 'col-auto  pt-1'
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          className: 'col-auto',
          template: '<p>' + this.translateService.instant('d1_txt14') + '</p>',
        }
      ],
      expressions: {
        hide: (field: any) => {
          if (field.model.flag_partita_iva === false || field.model.flag_partita_iva === 0) {
            return true;
          }
        },
        'props.required': (field: FormlyFieldConfig) => {
          return !field.hide;
        }
      },
    },
  ];

  // ALLEGATI
  fields5: FormlyFieldConfig[] = [
    {
      template: '<h5>' + this.translateService.instant('d1_title7') + '</h5>',
    },
    {
      key: 'attachments',
      type: 'repeat',
      props: {
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
                defaultValue: 'DOM_GS',

                props: {
                  type: 'hidden',
                  //label: 'Tipo documento',
                }
              },
              // filename
              {
                key: 'filename',
                type: 'fileinput',
                className: 'col-md-6',
                props: {
                  translate: true,
                  label: 'd1_txt17',
                  type: 'input',
                  description: 'N.B. Il documento da caricare deve essere in formato PDF',
                  placeholder: 'Carica il documento . . .',
                  accept: 'application/pdf',
                  required: false,
                  maxLength: 255,
                  onSelected: (selFile, field) => { this.onSelectCurrentFile(selFile, field); }
                },
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
    private d1inpsService: D1InpsService,
    private precontrattualeService: PrecontrattualeService,
    protected translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.d1inpsService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                this.model = response['datiPrecontrattuale']['copy'];
              }
              this.idins = +params.get('id');

              if (response.message) {
                this.messageService.info(response.message)
              }
            },
            (error) => this.handleError(error),
            () => this.complete(false)
          );
        } else {
          this.isLoading = true;
          this.d1inpsService.getInps(+params.get('id')).subscribe(
            response => {
              this.model = response['datiInps'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idD1: number) {
    // console.log(this.formAttch.value);
    // console.log(this.model);
    this.isLoading = true;
    if (idD1 === 0) {
      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      this.newPrevidenziale(preStore);
    } else {
      this.updateD1(this.model, idD1);
    }
  }

  newPrevidenziale(inps: any) {
    this.precontrattualeService.newInps(inps).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.1: Dichiarazione ai fini previdenziali creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          this.precontr = response['data'];
          this.router.navigate(['home/inps/details', this.precontr.d1_inps_id]);

        } else {
          this.messageService.error(response['message']);
        }

      }
    );
  }

  updateD1(inps: any, idD1: number) {
    // console.log(prestaz);
    this.d1inpsService.updateInps(inps, idD1).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.1: Dichiarazione ai fini previdenziali aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/inps/details', idD1]);
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

}
