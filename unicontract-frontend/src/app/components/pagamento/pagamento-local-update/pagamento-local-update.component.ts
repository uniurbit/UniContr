import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagamentoService } from './../../../services/pagamento.service';
import { Pagamento } from './../../../classes/pagamento';
import { MessageService, BaseComponent } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pagamento-local-update',
  templateUrl: './pagamento-local-update.component.html',
  styleUrls: ['./pagamento-local-update.component.css']
})
export class PagamentoLocalUpdateComponent extends BaseComponent {

  pagamento: Pagamento;

  model: any;

  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };
  form = new FormGroup({});

  fields: FormlyFieldConfig[] = [
    // scelta modalità di pagamento
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title:  this.translateService.instant('a2_title1')
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
                { key: 'AGBM', value: this.translateService.instant('a2_check1') },
                { key: 'ACIC', value: this.translateService.instant('a2_check2') }
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
        title:  this.translateService.instant('a2_title2')
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
            },
            validation: {              
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
      ]
    }
  ];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private pagamentoService: PagamentoService,
              public messageService: MessageService,
              private tools: InsegnamTools,
              protected translateService: TranslateService) {
                super(messageService);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // this.pagamento = new Pagamento();
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.pagamentoService.getPagamentoLocal(+params.get('id')).subscribe(
          response => this.pagamento = response['dati'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateA2(pagamento: Pagamento, idA2: number) {
    this.pagamentoService.updatePagamentoLocal(pagamento, idA2).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro A.2: Dati modalità di pagamento aggiornati con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/pagamento/local', idA2]);
      }
    );
  }

}
