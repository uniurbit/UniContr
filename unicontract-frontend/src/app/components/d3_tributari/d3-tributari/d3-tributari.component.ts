import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdD3 } from './../../../classes/precontrattuale';
import { D3Tributari } from './../../../classes/d3tributari';
import { D3TributariService } from './../../../services/d3tributari.service';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { NgbStringAdapter } from 'src/app/NgbStringAdapter';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-d3-tributari',
  templateUrl: './d3-tributari.component.html',
  styleUrls: ['./d3-tributari.component.css']
})
export class D3TributariComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdD3;
  idins: number;
  adapter = new NgbStringAdapter();      
  
  formAttch = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fieldsEnti: FormlyFieldConfig[] = [
    // ente carica oggetto
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // Ente
        {
          key: 'ente',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            required: true,
            label: 'Ente',
          },
        },
        // Rapporto
        {
          key: 'rapporto',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            required: true,
            label: 'Natuta Incarico / Rapporto',
          },
        },
      ],
      hideExpression: (model, formstate) => {
        return (this.model.flag_limite_percepito === 0);
      }
    },
    // dal girono - al giorno
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        // dal girono
        {
          key: 'dal_giorno',
          type: 'date',
          className: 'col-md-3',
          templateOptions: {
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
                    al_giorno.templateOptions.datepickerOptions.minDate = this.adapter.fromModel(val);        
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
          className: 'col-md-3',
          templateOptions: {
            required: true,
            label: 'Al giorno',
          },
        },
        {
          key: 'importo_totale',
          type: 'maskcurrency',
          className: 'col-md-3',
          templateOptions: {
            required: true,
            label: 'Importo totale',
          },
        },
        {
          key: 'importo_annuo',
          type: 'maskcurrency',
          className: 'col-md-3',
          templateOptions: {
            required: true,
            label: 'Importo annuo',
          },
        },
      ],
      hideExpression: (model, formstate) => {
        return (this.model.flag_limite_percepito === 0);
      }
    },
  ];

  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          template: '<h5>' + this.translateService.instant('d3_intest') + '</h5>'
        },
        {
          type: 'radio',
          key: 'flag_percepito',
          defaultValue: 0,
          templateOptions: {
            options: [
              {key: 0, value: this.translateService.instant('d3_txt2')},
              {key: 1, value: this.translateService.instant('d3_txt3')}
            ],
            required: true,
            translate: true,
            label: 'd3_txt1'
          },
          expressionProperties: {}
        }
      ]
    },
    {
      fieldGroup: [
        {
          type: 'radio',
          key: 'flag_limite_percepito',
          defaultValue: 0,
          templateOptions: {
            options: [
              {key: 0, value: this.translateService.instant('d3_txt4')},
              {key: 1, value: this.translateService.instant('d3_txt5')}
            ],
            required: true
          },
          expressionProperties: {}
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.flag_percepito === 0) {
          return model;
        }
      },
    },

    // elenco enti
    {
      fieldGroupClassName: 'row justify-content-end',
      className: 'col-md-12',
      fieldGroup: [
        {
          key: 'enti',
          type: 'repeat',
          className: 'col-md-12',
          validation: {
            show: true
          },
          templateOptions: {
            label: 'Elenco enti',
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
              message: (error, field: FormlyFieldConfig) => `Inserire almeno un ente`,
            }
          },
          fieldArray: {
            fieldGroup: this.fieldsEnti,
          },
          hideExpression: (model, formstate) => {
            return (this.model.flag_limite_percepito === 0);
          }
        },
      ],
    },

  ];

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messageService: MessageService,
    private d3Service: D3TributariService,
    private precontrattualeService: PrecontrattualeService,
    protected translateService: TranslateService,
    private tools: InsegnamTools,
    private cdr: ChangeDetectorRef) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.d3Service.getPrecontr(+params.get('id')).subscribe(
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
          this.d3Service.getDatiTributari(+params.get('id')).subscribe(
            response => {
              this.model = response['datiTributari'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idD3: number) {
    // console.log(this.formAttch.value);
    // console.log(this.model);
    this.isLoading = true;
    if (idD3 === 0) {
      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      this.newTributari(preStore);
    } else {
      this.updateD3(this.model, idD3);
    }
  }

  newTributari(tribut: any) {
    this.d3Service.newDatiTributari(tribut).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.3: Dichiarazione ai fini tributari creato con successo');
          const data = response['datiTributari'];
          this.router.navigate(['home/tributari/details',  data.id ]);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

  updateD3(tribut: any, idD3: number) {
    this.d3Service.updateDatiTributari(tribut, idD3).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.3: Dichiarazione ai fini tributari aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/tributari/details', idD3]);
      }
    );
  }

}
