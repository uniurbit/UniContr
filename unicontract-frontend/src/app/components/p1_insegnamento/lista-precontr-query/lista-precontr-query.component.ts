import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DatePipe } from '@angular/common';
import { BaseResearchComponent } from 'src/app/shared';
import { Page } from 'src/app/shared/lookup/page';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { annoAccademicoCorrente } from 'src/app/shared/dynamic-form/utils';
import { encode, decode } from 'base64-arraybuffer';

@Component({
  selector: 'app-lista-precontr-query',
  templateUrl: '../../../shared/base-component/base-research.component.html',
  styles: []
})
export class ListaPrecontrQueryComponent extends BaseResearchComponent {
  enabledExport = true;
  translate: MyTranslatePipe;

  fieldsRow: FormlyFieldConfig[] = [
    {
      key: 'precontr.id',
      type: 'number',
      templateOptions: {
        label: 'Codice',        
      }
    },    
    {
      key: 'insegnamento.aa',
      type: 'select',
      templateOptions: {
        label: 'Anno',
        valueProp: 'value',
        labelProp: 'label',
        options: this.service.getAnniAccademici()
      }
    },
    {
      key: 'insegnamento.insegnamento',
      type: 'string',
      templateOptions: {
        label: 'Insegnamento',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },

    // "005019_disb" :
    // "004919_dispea"
    // "004419_digiur"
    // "004940_discui"
    // "004939_distum"
    // "004424_desp" :

    {
      key: 'insegnamento.dip_cod',
      type: 'select',
      templateOptions: {
        label: 'Dipartimento',
        options: [
          { key: '005019', value: this.translateService.instant('005019_disb') },
          { key: '004919', value: this.translateService.instant('004919_dispea')},
          { key: '004419', value: this.translateService.instant('004419_digiur') },
          { key: '004940', value: this.translateService.instant('004940_discui') },
          { key: '005579', value: this.translateService.instant('005579_discui') },
          { key: '004939', value: this.translateService.instant('004939_distum') },
          { key: '004424', value: this.translateService.instant('004424_desp') }
        ]
      }
    },
    {
      key: 'insegnamento.data_ini_contr',
      type: 'date',
      templateOptions: {
        label: 'Data inizio',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'insegnamento.data_fine_contr',
      type: 'date',
      templateOptions: {
        label: 'Data fine',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'insegnamento.coper_id',
      type: 'number',
      templateOptions: {
        label: 'Copertura',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'insegnamento_tipo_contratto',
      type: 'select',
      templateOptions: {
        label: 'Tipo contratto',
        options: [
          { key: 'ALTAQUALIFICAZIONE', value: 'Contratto di Alta Qualificazione' },
          { key: 'DIDATTICAUFFICIALE', value: 'Contratto di Didattica Ufficiale'},
          { key: 'DIDATTICAINTEGRATIVA', value:'Contratto di Didattica Integrativa'},
          { key: 'SUPPORTO', value: 'Contratto di Supporto alla Didattica' },
        ],
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'insegnamento.compenso',
      type: 'number',
      templateOptions: {
        type: 'number',
        label: 'Compenso',
        required: true,        
      }
    },
    {
      key: 'p2naturarapporto.natura_rapporto',
      type: 'select',
      templateOptions: {
        label: 'Natura del rapporto',
        options: [
          { key: 'PRPR', value: this.translateService.instant('p3_radio1') },
          { key: 'COCOCO', value: this.translateService.instant('p3_radio2')},
          { key: 'PLAO', value: this.translateService.instant('p3_radio3') },
          { key: 'PTG', value: this.translateService.instant('p3_radio4') },
          { key: 'ALD', value: this.translateService.instant('p3_radio5') }
        ],
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'flag_no_compenso',
      type: 'select',
      templateOptions: {
        label: 'Rinuncia al compenso',
        options: [
          { key: true, value: this.translateService.instant('txt_si') },
          { key: false, value: this.translateService.instant('txt_no')},
        ],
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'user.name',
      type: 'string',
      templateOptions: {
        label: 'Nominativo docente (nome cognome)',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'currentState',
      type: 'select',
      templateOptions: {
        label: 'Stato corrente',
        required: true,
        options: [
          {key: 'aperta', value: 'Aperta in fase di compilazione'},
          {key: 'compilata', value: 'Compilata in attesa validazione Ufficio Amm.ne e Reclutamento'},
          {key: 'validazione1', value: 'Validata in attesa validazione Ufficio Trattamenti Economici e Previdenziali'},
          {key: 'validazione2', value: 'Validata in attesa accettazione e presa visione'},
          {key: 'accettata', value: 'Accettata in attesa di firma'},
          {key: 'firmata', value: 'Firmata'},
          {key: 'annullata', value: 'Annullata'},
        ]
      }
    },
    {
      key: 'validazioni.tipo_accettazione',
      type: 'select',
      templateOptions: {
        label: 'Tipo accettazione',
        required: true,
        options: [
          {key: 'PRESA_ViSIONE', value: 'Presa visione'},
          {key: 'USIGN', value: 'U-Sign'},
          {key: 'FIRMAIO', value: 'Firma con IO'},
        ]
      }
    },
  ];

  keyValueRulesTipoContratto: { [key: string]: any[]} = {
    'ALTAQUALIFICAZIONE': [
      { field: "insegnamento.tipo_contratto", operator: "In", value: ['ALTQG','ALTQC','ALTQU'], type: "" },
    ],
    'DIDATTICAUFFICIALE': [
      { field: "insegnamento.tipo_contratto", operator: "In", value: ['CONTC', 'CONTU'], type: "" },    
    ],
    'DIDATTICAINTEGRATIVA': [
      { field: "insegnamento.tipo_contratto", operator: "In", value: ['INTC','INTU','INTXU','INTXC'], type: "" },
    ],
    'SUPPORTO': [
      { field: "insegnamento.tipo_contratto", operator: "In", value: ['SUPPU','SUPPC'], type: "" },    
    ],
  };

  keyValueInverseRulesTipoContratto: { [key: string]: any[]} = {
    'ALTAQUALIFICAZIONE': [
      { field: "insegnamento.tipo_contratto", operator: "NotIn", value: ['ALTQG','ALTQC','ALTQU'], type: "" },
    ],
    'DIDATTICAUFFICIALE': [
      { field: "insegnamento.tipo_contratto", operator: "NotIn", value: ['CONTC', 'CONTU'], type: "" },    
    ],
    'DIDATTICAINTEGRATIVA': [
      { field: "insegnamento.tipo_contratto", operator: "NotIn", value: ['INTC','INTU','INTXU','INTXC'], type: "" },
    ],
    'SUPPORTO': [
      { field: "insegnamento.tipo_contratto", operator: "NotIn", value: ['SUPPU','SUPPC'], type: "" },    
    ],
  };

  keyValueRules: { [key: string]: any[]} = {
    'aperta': [
      { field: "validazioni.flag_submit", operator: "=", value: 0, type: "" },
      { field: "stato", operator: "=", value: 0, type: "" }
    ],
    'compilata': [
      { field: "validazioni.flag_submit", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_upd", operator: "=", value: 0, type: "" },
      { field: "stato", operator: "=", value: 0, type: "" }      
    ],
    'validazione1': [
      { field: "validazioni.flag_submit", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_upd", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_amm", operator: "=", value: 0, type: "" },
      { field: "stato", operator: "=", value: 0, type: "" }      
    ],
    'validazione2': [
      { field: "validazioni.flag_submit", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_upd", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_amm", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_accept", operator: "=", value: 0, type: "" },
      { field: "stato", operator: "=", value: 0, type: "" }      
    ],
    'accettata': [
      { field: "validazioni.flag_submit", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_upd", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_amm", operator: "=", value: 1, type: "" },
      { field: "validazioni.flag_accept", operator: "=", value: 1, type: "" },
      { field: "stato", operator: "=", value: 0, type: "" }      
    ],
    'firmata': [
      { field: "stato", operator: "=", value: 1, type: "" },      
    ],
    'annullata': [      
      { field: "stato", operator: ">", value: 1, type: "" }
    ],

  };

  keyValueInverseRules: { [key: string]: any[]} = {
    'aperta': [
      { field: "validazioni.flag_submit", operator: "!=", value: 0, type: "" },
    ],
    'compilata': [
      { field: "validazioni.flag_submit", operator: "!=", value: 1, type: "" },      
    ],
    'validazione1': [      
      { field: "validazioni.flag_upd", operator: "!=", value: 1, type: "" },      
    ],
    'validazione2': [      
      { field: "validazioni.flag_amm", operator: "!=", value: 1, type: "" },      
    ],
    'accettata': [      
      { field: "validazioni.flag_accept", operator: "!=", value: 1, type: "" },      
    ],
    'firmata': [
      { field: "stato", operator: "!=", value: 1, type: "" },      
    ],
    'annullata': [      
      { field: "stato", operator: "<", value: 2, type: "" }
    ],
  };


  protected getRules(model) {
    if (model.rules) {
      let rules = JSON.parse(JSON.stringify(model.rules)) as (Array<any>);
      let ruleState = rules.find(x => x.field == 'currentState'); 
      while (ruleState) {
        if (ruleState) {
          rules.splice(rules.indexOf(ruleState), 1);
          if (ruleState.operator === '=') {
            rules  = rules.concat(this.keyValueRules[ruleState.value]);
          } else {
            rules  = rules.concat(this.keyValueInverseRules[ruleState.value]);
          }
        }
        ruleState = rules.find(x => x.field == 'currentState');
      }     
     
      let ruleTipoContratto = rules.find(x => x.field == 'insegnamento_tipo_contratto');      
      while (ruleTipoContratto) {
        if (ruleTipoContratto) {
          rules.splice(rules.indexOf(ruleTipoContratto), 1);
          if (ruleTipoContratto.operator == '=') {
            rules  = rules.concat(this.keyValueRulesTipoContratto[ruleTipoContratto.value]);
          } else {
            rules  = rules.concat(this.keyValueInverseRulesTipoContratto[ruleTipoContratto.value]);
          }
        }
        ruleTipoContratto = rules.find(x => x.field == 'insegnamento_tipo_contratto'); 
      }

      return rules;
    }
    return model.rules;
  }

  resultMetadata: FormlyFieldConfig[];
  @ViewChild('tooltip', { static: true }) tooltipCellTemplate: TemplateRef<any>;

  constructor(protected service: PrecontrattualeService, router: Router, route: ActivatedRoute, private translateService: TranslateService) {
    super(router, route);
    this.enableNew = false;
    // percorso usato per apertura doppio click
    // this.routeAbsolutePath = 'home/detail-insegn';
    this.routeAbsolutePath = 'home/summary';
    this.translate = new MyTranslatePipe(translateService);
    this.prefix = 'precontr';

    this.initRule();
    
    if (this.rules == null){
      const year = annoAccademicoCorrente();
      this.rules = [{field: "insegnamento.aa", operator: "=", value: year}];
    }
   }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {

    let page = new Page(25);
    let result = null;
    if (this.getStorageResult()){
      result = JSON.parse(this.getStorageResult());
      this.init = true;
      page.totalElements = result.total; // data.to;
      page.pageNumber = result.current_page - 1;
      page.size = result.per_page;
    }

    this.resultMetadata = [       
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        headerHeight: 50,
        footerHeight: 50,
        label: 'Risultati precontrattuali',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '', prop: 'insegn_id',  with: 100, maxWidth: 100, cellTemplate: this.comandi },
          { name: '#', prop: 'id', width: 80, maxWidth: 100 },
          { name: 'Copertura', prop: 'insegnamento.coper_id', width: 100, maxWidth: 100 },
          { name: 'Dipartimento', prop: 'insegnamento.dip_cod', cellTemplate: this.tooltipCellTemplate, width: 100, maxWidth: 150 },
          { name: 'Inizio', prop: 'insegnamento.data_ini_contr', width: 100, maxWidth: 150, type: 'date' },
          { name: 'Fine', prop: 'insegnamento.data_fine_contr', width: 100, maxWidth: 150, type: 'date' },
          { name: 'Cognome', prop: 'user.cognome', width: 150, maxWidth: 150 },
          { name: 'Nome', prop: 'user.nome', width: 150, maxWidth: 150 },
          { name: 'Insegnamento', prop: 'insegnamento.insegnamento', width: 450 },
          { name: 'Rapporto', prop: 'p2naturarapporto.natura_rapporto', pipe: this.translate, width: 100, maxWidth: 150 },
          { name: 'Stato corrente', prop: 'currentState', minWidth: 100 },
          { name: 'Tipo accettazione', prop: 'validazioni.tipo_accettazione', minWidth: 100 },
        ]
      },
      fieldArray: {
        fieldGroup: []
      }
    },
    // {
    //   template: "<div>Usa il tasto <span class='oi oi-external-link ml-1 mr-1'></span> oppure doppio click sulla riga per accedere alla precontrattuale</div>",
    //   hideExpression: (model, formstate) => {
    //     if (model.data){
    //       if (model.data.length > 0)
    //         return false;
    //     }
    //     return true;
    //   },
    // }

  ];

    if (result) {
      this.setResult(result);
    }

  }

  downloadDisabled(row){
    if (row.stato == 1){
      return false;
    }
    return true;
  }

  downloadSelection(row){
    if (row.stato==1) {
      this.isLoading = true;
      this.service.downloadContrattoFirmato(row.id).subscribe(file => {
        this.isLoading = false;
        if (file.filevalue) {
          const blob = new Blob([decode(file.filevalue)]);
          saveAs(blob, file.filename);
        }
      },
        e => { 
          this.isLoading = false;
          console.log(e); 
        }
      );
    }
  }



}
