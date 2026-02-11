import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { Updb3 } from './../../../classes/precontrattuale';
import { B3RapportoStudioUniversita } from './../../../classes/b3rappStudio';
import { B3RappStudioUnivService } from './../../../services/b3rappStudio.service';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';

import { NgbStringAdapter } from 'src/app/NgbStringAdapter';
import { takeUntil, tap } from 'rxjs/operators';


@Component({
    selector: 'app-b3-rapp-studio-univ',
    templateUrl: './b3-rapp-studio-univ.component.html',
    styleUrls: ['./b3-rapp-studio-univ.component.css'],
    standalone: false
})
export class B3RappStudioUnivComponent extends BaseComponent {

  items: any = null;
  private precontr: Updb3;
  idins: number;

  adapter = new NgbStringAdapter();                

  rapps: Array<Object> = [
    {rapp: '', name: ''},
    {rapp: 'DDR', name: 'Dottorato di ricerca'},
    {rapp: 'ADR', name: 'Assegno di ricerca'},
    {rapp: 'BDS', name: 'Borsa di studio'},
    {rapp: 'BPD', name: 'Borsa post-dottorato'}
  ];

  leggi: Array<Object> = [
    {legge: '', name: ''},
    {legge: 'L. 240/2010 (Legge Gelmini)', name: 'L. 240/2010 (Legge Gelmini)'},
    {legge: 'L. 449/1997, Art. 51', name: 'L. 449/1997, Art. 51'}
  ];

  formAttch = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fieldsRapporti: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'tipologia_rapporto',
          type: 'select',
          defaultValue: 'DDR',
          className: 'col-md-6',
          props: {
            options: this.rapps,
            valueProp: 'rapp',
            labelProp: 'name',
            label: 'Tipologia di rapporto con l\'Università',
            required: true,
          }
        }
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'universita',
          type: 'input',
          className: 'col-md-6',
          props: {
            label: '',
            required: true,
            // placeholder: 'UNIVERSITÀ DEGLI STUDI DI . . .',
            // description: 'Inserire la data odierna'
          },
          expressionProperties: {
            'props.label': (model: any, formState: any) => {
              if (model.tipologia_rapporto === 'DDR') {
                return this.translateService.instant('b3_txt1');
              } else if (model.tipologia_rapporto === 'ADR') {
                return this.translateService.instant('b3_txt3');
              } else if (model.tipologia_rapporto === 'BDS') {
                return this.translateService.instant('b3_txt5');
              } else if (model.tipologia_rapporto === 'BPD') {
                return this.translateService.instant('b3_txt4');
              }
            },
          }
        },
        {
          key: 'dipartimento',
          type: 'input',
          className: 'col-md-6',
          props: {
            label: 'Dipartimento di',
            required: true,
            // placeholder: 'DIPARTIMENTO . . .',
          },
          expressionProperties: {
            'props.label': (model: any, formState: any) => {
              if (model.tipologia_rapporto === 'DDR') {
                return this.translateService.instant('b3_txt2');
              } else {
                return this.translateService.instant('b3_txt8');
              }
            },
          }
        },
      ],
      hideExpression: (model: any, formState: any) => {
        return (model.tipologia_rapporto == '');                           
      }
    },

    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'riferimenti_legge',
          type: 'select',
          className: 'col-md-3',
          props: {
            options: this.leggi,
            valueProp: 'legge',
            labelProp: 'name',
            translate: true,
            label: 'b3_txt9',
            required: true,
          },
          /*
          key: 'riferimenti_legge',
          type: 'input',
          className: 'col-md-3',
          props: {
            translate: true,
            label: 'b3_txt9',
            required: true,
          },
          */
          hideExpression: (model: any, formState: any) => {
            return (model.tipologia_rapporto !== 'ADR');                           
          }
        },
        {
          key: 'dal_giorno',
          type: 'date',
          className: 'col-md-3',
          props: {
            label: 'dal giorno',
            required: true,          
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
        {
          key: 'al_giorno',
          type: 'date',
          className: 'col-md-3',
          props: {
            label: 'al giorno',
            required: true,
          },        
        }
      ],
    },
  ];

  fields: FormlyFieldConfig[] = [
    {
      template: '<h5>Rapporti di studio o lavoro</h5>'
    },
    // elenco rapporti
    {
      fieldGroupClassName: 'row justify-content-end',
      className: 'col-md-12',
      fieldGroup: [
        {
          key: 'rapporti',
          type: 'repeat',
          className: 'col-md-12',
          validation: {
            show: true
          },
          props: {
            // label: 'Elenco rapporti',
            min: 1,
            max: 4,
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
              message: (error, field: FormlyFieldConfig) => `Inserire almeno un rapporto di studio o lavoro con l\'Università`,
            }
          },
          fieldArray: {
            fieldGroup: this.fieldsRapporti,
          }
        },
      ],
    },

  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private rapportoUnivService: B3RappStudioUnivService,
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
          this.update=false;
          this.isLoading = true;
          this.rapportoUnivService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = new B3RapportoStudioUniversita();
              this.items = response['datiPrecontrattuale'];

              // se esiste una copia locale utilizzo quella
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                this.items = response['datiPrecontrattuale'];
                this.model = response['datiPrecontrattuale']['copy'];
                // Object.keys(copy).forEach(key=>this.item[key]=copy[key]);
              } else {
                this.items.flag_rapporto_universita = true;
              }


              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.rapportoUnivService.getRappStudio(+params.get('id')).subscribe(
            response => {
              this.model = response['datiRapporto'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idB3: number) {
    this.isLoading = true;
    if (idB3 === 0) {
      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      this.newRapporto(preStore);
    } else {
      this.updateB3(this.model, idB3);
    }
  }

  newRapporto(studio: any) {
    this.rapportoUnivService.newRappStudio(studio).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro B.3: Rapporto di studio o lavoro con l\'Università crato con successo');
          const data = response['datiRappStudio'];          
          this.router.navigate(['home/studio/details',  data.id ]);
        } else {
          this.messageService.error(response['message']);
        }        
      }
    );
  }

  updateB3(studio: any, idB3: number) {
    this.rapportoUnivService.updateRappStudio(studio, idB3).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro B.3: Rapporto di studio o lavoro con l\'Università aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }     
        this.router.navigate(['home/studio/details', idB3]);
      }
    );
  }

}
