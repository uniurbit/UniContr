import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagamentoService } from './../../../services/pagamento.service';
import { Pagamento } from './../../../classes/pagamento';
import { MessageService, BaseComponent } from './../../../shared';
import { Precontrattuale } from './../../../classes/precontrattuale';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { Upda2 } from './../../../classes/precontrattuale';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { A2ModPagamento } from 'src/app/interface/pagamento';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';

@Component({
  selector: 'app-pagamento-details',
  templateUrl: './pagamento-details.component.html',
  styleUrls: ['./pagamento-details.component.css']
})
export class PagamentoDetailsComponent extends BaseComponent {

  static informazioni_pagamento = (translateService: TranslateService):FormlyFieldConfig => {
    // Delibera n. 318/2022 del Consiglio di Amministrazione del 28/10/2022 dati relativi al soluzioni di pagamento 
    return {
      wrappers: ['riquadro'],
      hideExpression:  (model: any, formState: any) => {
        //email Ufficio Trattamenti Economici e Previdenziali 17/11 
        return !(formState.precontr && ['COCOCO'].includes(formState.precontr.p2naturarapporto.natura_rapporto) && formState.precontr.insegnamento.compenso > 3000 && formState.precontr.insegnamento.aa >= 2022)
      },
      templateOptions: {
        title: translateService.instant('a2_title3')
      },
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'soluzione_pagamento',
              type: 'select',              
              className: 'col-md-6',                            
              templateOptions: {
                label: 'Soluzione di pagamento',
                options: [
                  { value:'una_rata', label: 'Unica rata' },
                  { value:'due_rate', label: 'Due rate' }
                ],    
                description: 'Delibera n. 318/2022 del Consiglio di Amministrazione del 28/10/2022',            
                required: true,
              }
            }
          ],
        },        
      ]
    }
  }

  originalValue: any; //in caso di nuovo

  pagamento: A2ModPagamento;
  private precontr: Upda2;
  modality = 'ACIC';
  idins: number;

  model: any = null;

  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };
  form = new UntypedFormGroup({});

  fields: FormlyFieldConfig[] = [
    // scelta modalità di pagamento
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title: this.translateService.instant('a2_title1')
      },
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'modality',
          type: 'radio',
          className: 'col-md-6',
          defaultValue: 'ACIC',
          templateOptions: {
            required: true,
            options: []
          },
          expressionProperties: {
            'templateOptions.options': (model: any, formState: any, field: FormlyFieldConfig) => {
              return [
                { value: 'ACIC', label: this.translateService.instant('a2_check2') },
                { value: 'AGBM', label: this.translateService.instant('a2_check1') },
              ];
            },
            'templateOptions.description': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.modality === 'AGBM') {
                 return this.translateService.instant('a2_info1');
              } else {
                return '';
              }
            }
          }
        },
      ]
    },
    // dati relativi al cc
    {
      wrappers: ['riquadro'],
      hideExpression:  (model: any, formState: any) => model.modality === 'AGBM',
      templateOptions: {
        title: this.translateService.instant('a2_title2')
      },
      fieldGroup: [
        // intestatario cc
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
          {
            key: 'intestazione',
            type: 'input',
            className: 'col-md-6',
            validation: {
              show: true
            },
            templateOptions: {
              translate: true,
              label: 'a2_label1',
              required: true,
            },
          }],
        },
        // codice iban
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
          {
            key: 'iban',
            type: 'input',
            className: 'col-md-6',
            templateOptions: {
              translate: true,
              label: 'a2_label2',
              required: true,
              maxLength: 27,
              pattern: /^(?:(?:IT|SM)\d{2}[A-Z]{1}[0-9]{5}[0-9]{5}[0-9A-Z]{12}|NL\d{2}[A-Z]{4}\d{10}|LV\d{2}[A-Z]{4}\d{13}|(?:BG|BH|GB|IE)\d{2}[A-Z]{4}\d{14}|GI\d{2}[A-Z]{4}\d{15}|RO\d{2}[A-Z]{4}\d{16}|KW\d{2}[A-Z]{4}\d{22}|MT\d{2}[A-Z]{4}\d{23}|NO\d{13}|(?:DK|FI|GL|FO)\d{16}|MK\d{17}|(?:AT|EE|KZ|LU|XK)\d{18}|(?:BA|HR|LI|CH|CR)\d{19}|(?:GE|DE|LT|ME|RS)\d{20}|IL\d{21}|(?:AD|CZ|ES|MD|SA)\d{22}|PT\d{23}|(?:BE|IS)\d{24}|(?:FR|MR|MC)\d{25}|(?:AL|DO|LB|PL)\d{26}|(?:AZ|HU)\d{27}|(?:GR|MU)\d{28})$/
              //pattern:  '[A-Z]{2}[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[0-9A-Z]{12}'             
            },
            validation: {
              show: true,
              messages: {
                pattern: (error, field: FormlyFieldConfig) => `Formato IBAN non valido`,
              },
            },
          }],
        },      
        // denominazione banca indirizzo agenzia
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'denominazione',
              type: 'input',
              className: 'col-md-6',
              templateOptions: {
                translate: true,
                label: 'a2_label3',
              }
            },
            {
              key: 'luogo',
              type: 'input',
              className: 'col-md-6',
              templateOptions: {
                translate: true,
                label: 'a2_label4',
              }
            }
          ]
        },
        // codice bic codice aba
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'bic',
              type: 'input',
              className: 'col-md-6',
              templateOptions: {
                translate: true,
                label: 'a2_label5',
                description: this.translateService.instant('a2_info2'),
                maxLength: 15
              }
            },
            {
              key: 'aba',
              type: 'input',
              className: 'col-md-6',
              templateOptions: {
                translate: true,
                label: 'a2_label6',
                description: this.translateService.instant('a2_info2'),
                maxLength: 12
              }
            }
          ]
        },
        {
          fieldGroup: [
            {
              template: '<p>' + this.translateService.instant('a2_note') + '</p>'
            }
          ]
        },
      ]
    },
    PagamentoDetailsComponent.informazioni_pagamento(this.translateService)
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pagamentoService: PagamentoService,
              public messageService: MessageService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,
              ) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.update = false;
        this.isLoading = true;
        this.pagamentoService.getPagamento(params.get('id_ab'), params.get('idins')).subscribe(
          response => {

            if (response['dati']) {
              this.pagamento = response['dati'];

              // se esiste una copia locale utilizzo quella
              let copy = response['dati']['copy'];
              if (copy) {
                Object.keys(copy).forEach(key => this.pagamento[key] = copy[key]);
                this.originalValue = JSON.parse(JSON.stringify(response['dati']['copy']));
                //mostra gli errori
                this.fields.forEach(f => ControlUtils.validate(f));                                 
              } else {
                this.pagamento.denominazione = response['dati'].descr;
                this.pagamento.intestazione = response['dati'].intest_conto;
                this.pagamento.tipologia_conto_corrente = response['dati'].tipo_pag;
                this.originalValue = JSON.parse(JSON.stringify(this.pagamento));
              }

              if (response['dati']['precontr']){
                this.options.formState.precontr = response['dati']['precontr'];
              }

            } else {
              this.pagamento = <A2ModPagamento>{};
            }

            this.idins = +params.get('idins');
            this.form.markAsTouched();
          },
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  saveData(data) {
    data = {...this.pagamento, ...data};
    this.newPagamento(data);
  }

  newPagamento(pagamento: A2ModPagamento) {
    pagamento['insegn_id'] = this.idins;
    pagamento['originalValue'] = this.originalValue;
    // console.log(pagamento);
    this.isLoading = true;
    this.pagamentoService.newPagamento(pagamento).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiPagamento']['id']; // RETURN LAST ID
        if (response['success']) {
          this.messageService.info('Quadro A.2: Modalità di pagamento creato con successo');
          this.router.navigate(['home/pagamento/local', lastid]);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

}
