import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { B1ConflittoService } from './../../../services/b1conflitto.service';
import { B1Conflitto } from './../../../classes/b1conflitto';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { Updb1 } from './../../../classes/precontrattuale';
import { encode, decode } from 'base64-arraybuffer';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil, tap } from 'rxjs/operators';
import { NgbStringAdapter } from 'src/app/NgbStringAdapter';


@Component({
    selector: 'app-b1-conflitto',
    templateUrl: './b1-conflitto.component.html',
    styleUrls: ['./b1-conflitto.component.css'],
    standalone: false
})

export class B1ConflittoComponent extends BaseComponent {

  items: B1Conflitto = null;
  private precontr: Updb1;
  idins: number;
  adapter = new NgbStringAdapter();   
  
  optionsAnagrafica: FormlyFormOptions = {
    formState: {
      model: this.items,
      isLoading: this.isLoading,
    },
  };
  form = new UntypedFormGroup({});

  fieldsCarica: FormlyFieldConfig[] = [
        // ente carica oggetto
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // ente
            {
              key: 'ente',
              type: 'input',
              className: 'col-md-4',
              props: {
                required: true,
                label: 'Ente',
                maxLength: 190,
              },
            },
            // carica
            {
              key: 'carica',
              type: 'input',
              className: 'col-md-4',
              props: {
                required: true,
                label: 'Tipologia carica',
                maxLength: 190,
              },
            },
            // oggetto
            {
              key: 'oggetto',
              type: 'input',
              className: 'col-md-4',
              props: {
                required: true,
                label: 'Oggetto',
                maxLength: 250,
                description: 'Lunghezza massima 250 caratteri'
              },
            },
          ],
        },
        // dal girono al giorno compenso
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // dal girono
            {
              key: 'dal_giorno',
              type: 'date',
              className: 'col-md-4',
              props: {
                required: true,
                label: 'Dal giorno',
              },
              hooks: {
                onInit: (field) => {
                  const form = field.formControl;
                  field.formControl.valueChanges.pipe(
                    takeUntil(this.onDestroy$),
                    tap(val => {      
                      if (field.formControl.valid){                     
                        let al_giorno = field.parent.fieldGroup.find(x => x.key == 'al_giorno');                        
                        al_giorno.props.datepickerOptions.minDate = this.adapter.fromModel(val);     
                        this.cdr.detectChanges();
                        //console.warn(field,field.formControl.valid, val)
                      }                                       
                    }),
                  ).subscribe();
                },
              }  
            },

            // al_giorno
            {
              key: 'al_giorno',
              type: 'date',
              className: 'col-md-4',
              props: {
                required: true,
                label: 'Al giorno',
              },
            },
            {
              key: 'compenso',
              type: 'maskcurrency',
              className: 'col-md-4',
              props: {
                required: true,
                label: 'Compenso lordo annuo',
              },
            },
          ],
        },
      ];


  fieldsIncarico: FormlyFieldConfig[] = [
    // ente carica oggetto
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // ente
        {
          key: 'ente',
          type: 'input',
          className: 'col-md-4',
          props: {
            required: true,
            label: 'Ente',
          },
        },
        // incarico
        {
          key: 'incarico',
          type: 'input',
          className: 'col-md-4',
          props: {
            required: true,
            label: 'Tipologia incarico',
          },
        },
        // oggetto
        {
          key: 'oggetto',
          type: 'input',
          className: 'col-md-4',
          props: {
            required: true,
            label: 'Oggetto',
            maxLength: 250,
            description: 'Lunghezza massima 250 caratteri'
          },
        },
      ],
    },
    // dal girono al giorno compenso
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // dal girono
        {
          key: 'dal_giorno',
          type: 'date',
          className: 'col-md-4',
          props: {
            required: true,
            label: 'Dal giorno',
          },
          hooks: {
            onInit: (field) => {
              const form = field.formControl;
              field.formControl.valueChanges.pipe(
                takeUntil(this.onDestroy$),
                tap(val => {      
                  if (field.formControl.valid){                     
                    let al_giorno = field.parent.fieldGroup.find(x => x.key == 'al_giorno');                        
                    al_giorno.props.datepickerOptions.minDate = this.adapter.fromModel(val);     
                    this.cdr.detectChanges();
                    //console.warn(field,field.formControl.valid, val)
                  }                                       
                }),
              ).subscribe();
            },
          }  
        },
        // al_giorno
        {
          key: 'al_giorno',
          type: 'date',
          className: 'col-md-4',
          props: {
            required: true,
            label: 'Al giorno',
          },
        },
        // compenso
        {
          key: 'compenso',
          type: 'maskcurrency',
          className: 'col-md-4',
          props: {
            required: true,
            label: 'Compenso lordo annuo',
          },
        },
      ],
    },
  ];


  fields: FormlyFieldConfig[] = [
    {
      wrappers: ['riquadro'],
      fieldGroup: [
        {
          type: 'template',
          className: 'mb-1',
          props: {
            // tslint:disable-next-line:max-line-length
            // "<div class='text'>{{ 'b1_txt1' | translate }} {{ tools.naturaRapporto(items.natura_rapporto) | titlecase }} {{ 'b1_txt2' | translate }}</div>"
            template: ''
          },
          expressionProperties: {
            'props.template': (model: any, formState: any, field: FormlyFieldConfig) => {
              // tslint:disable-next-line:max-line-length
              return `<div>${this.translateService.instant('b1_txt1')} ${this.tools.naturaRapporto(model.natura_rapporto)} ${this.translateService.instant('b1_txt2')}</div>`;
            }
          }
        },

        {
          type: 'template',
          className: 'mb-2',
          props: {
            template: this.translateService.instant('b1_txt3'),
          }
        },
        // flag controlli
        {
          key: 'flag_controll',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt4',
          },
        },
        // flag quota
        {
          key: 'flag_quota',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt5',
          },
        },
        // flag rappext
        {
          key: 'flag_rappext',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt6',
          },
        },
        // flag contrast
        {
          key: 'flag_contrast',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt7',
          },
        },
      ],
    },
    // secondo gruppo
    {
      wrappers: ['riquadro'],
      fieldGroup: [
        {
          type: 'template',
          className: 'mb-2',
          props: {
            template: this.translateService.instant('b1_txt8'),
          },
        },

        // flag_cariche
        {
          key: 'flag_cariche',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt9',
          },
        },

        // lista cariche
        {
          fieldGroupClassName: 'row justify-content-end',
          fieldGroup: [
            {
              key: 'cariche',
              type: 'repeat',
              className: 'col-md-12',
              validation: {
                show: true
              },
              props: {
                label: 'Elenco cariche',
                min: 1,
                max: 10,
                template: '<hr></hr>',
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
                  message: (error, field: FormlyFieldConfig) => `Inserire almeno una carica`,
                }
              },
              fieldArray: {
                fieldGroup: this.fieldsCarica,
              },
            },
          ],
          hideExpression: (model, formstate) => {
            if (model)
              return (!model.flag_cariche);
            return true;
          },
        },

        // flag incarichi
        {
          key: 'flag_incarichi',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt10',
          },
        },

        // lista incarichi
        {
          fieldGroupClassName: 'row justify-content-end',
          fieldGroup: [
            {
              key: 'incarichi',
              type: 'repeat',
              className: 'col-md-12',
              validation: {
                show: true
              },
              props: {
                label: 'Elenco incarichi',
                min: 1,
                max: 10,
                template: '<hr></hr>',
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
                  message: (error, field: FormlyFieldConfig) => `Inserire almeno un incarico`,
                }
              },
              fieldArray: {
                fieldGroup: this.fieldsIncarico,
              },
            },
          ],
          hideExpression: (model, formstate) => {
            if (model)
              return (!model.flag_incarichi);
            return true;
          },
        },

        // flag_attivita
        {
          key: 'flag_attivita',
          type: 'checkbox',
          defaultValue: false,
          props: {
            translate: true,
            label: 'b1_txt11',
          },
        },

        // descr_attivita
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'descr_attivita',
              type: 'input',
              className: 'col-md-6',
              props: {
                required: true,
                label: 'Attività professionale',
                maxLength: 190
              },
              hideExpression: (model, formstate) => {
                return (!model.flag_attivita);
              },
            }
          ],
        },
      ],
    }
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private conflittoService: B1ConflittoService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,
              private tools: InsegnamTools,
              private cdr: ChangeDetectorRef) {
    super(messageService);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;

          // id == insegn_id
          this.conflittoService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              this.idins = +params.get('id');

              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                Object.keys(copy).forEach(key => this.items[key] = copy[key]);
              } 
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          // b1_confl_interessi.id == id
          this.conflittoService.getConflitto(+params.get('id')).subscribe(
            response => {
              this.items = response['datiConflitto'];
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(data, idB1: number) {
    this.isLoading = true;
    if (idB1 === 0) {
      data['insegn_id'] = this.idins;
      this.newconflitto(data);
    } else {
      this.updateB1(data, idB1);
    }
  }

  newconflitto(conflitto: B1Conflitto) {
    this.conflittoService.newConflitto(conflitto).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiConflitto']['id']; // RETURN LAST ID
        if (response['success']) {
          this.messageService.info('Modello B.1: Dichiarazione conflitto di interessi creato con successo');          
          this.router.navigate(['home/conflitto/details', lastid]);
        } else {
          this.messageService.error(response['message']);
        }
       
      }
    );
  }

  updateB1(conflitto: B1Conflitto, idB1: number) {
    this.conflittoService.updateConflitto(conflitto, idB1).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello B.1: Dichiarazione conflitto di interessi aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }        
        this.router.navigate(['home/conflitto/details', idB1]);
      }
    );
  }

}
