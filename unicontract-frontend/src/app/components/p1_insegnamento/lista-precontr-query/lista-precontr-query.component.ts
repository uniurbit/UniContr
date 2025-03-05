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
import * as saveAs from 'file-saver';
import { PrecontrattualeDocenteService } from 'src/app/services/precontrattualedocente.service';

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
          { value: '005019', label: this.translateService.instant('005019_disb') },
          { value: '004919', label: this.translateService.instant('004919_dispea')},
          { value: '004419', label: this.translateService.instant('004419_digiur') },
          { value: '004940', label: this.translateService.instant('004940_discui') },
          { value: '005579', label: this.translateService.instant('005579_discui') },
          { value: '004939', label: this.translateService.instant('004939_distum') },
          { value: '004424', label: this.translateService.instant('004424_desp') }
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
          { value: 'ALTAQUALIFICAZIONE',  label: 'Contratto di Alta Qualificazione' },
          { value: 'DIDATTICAUFFICIALE',  label: 'Contratto di Didattica Ufficiale'},
          { value: 'DIDATTICAINTEGRATIVA',label:'Contratto di Didattica Integrativa'},
          { value: 'SUPPORTO',            label: 'Contratto di Supporto alla Didattica' },
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
          { value: 'PRPR',    label: this.translateService.instant('p3_radio1') },
          { value: 'COCOCO',  label: this.translateService.instant('p3_radio2')},
          { value: 'PLAO',    label: this.translateService.instant('p3_radio3') },
          { value: 'PTG',     label: this.translateService.instant('p3_radio4') },
          { value: 'ALD',     label: this.translateService.instant('p3_radio5') }
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
          { value: true,  label: this.translateService.instant('txt_si') },
          { value: false, label: this.translateService.instant('txt_no')},
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
      key: 'user.cognome',
      type: 'string',
      templateOptions: {
        label: 'Cognome docente',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'user.nome',
      type: 'string',
      templateOptions: {
        label: 'Nome docente',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'user.cf',
      type: 'string',
      templateOptions: {
        label: 'Codice fiscale docente',
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
          {value: 'aperta',       label: 'Aperta in fase di compilazione'},
          {value: 'compilata',    label: 'Compilata in attesa validazione Ufficio Amm.ne e Reclutamento'},
          {value: 'validazione1', label: 'Validata in attesa validazione Ufficio Trattamenti Economici e Previdenziali'},
          {value: 'validazione2', label: 'Validata in attesa accettazione e presa visione'},
          {value: 'accettata',    label: 'Accettata in attesa di firma'},
          {value: 'firmata',      label: 'Firmata'},
          {value: 'annullata',    label: 'Annullata'},
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
          {value: 'PRESA_VISIONE',  label: 'Presa visione'},
          {value: 'USIGN',          label: 'U-Sign'},
          {value: 'FIRMAIO',        label: 'Firma con IO'},
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

  constructor(protected service: PrecontrattualeService, protected serviceDocente: PrecontrattualeDocenteService, router: Router, route: ActivatedRoute, private translateService: TranslateService) {
    super(router, route);
    this.enableNew = false;
    // percorso usato per apertura doppio click
    // this.routeAbsolutePath = 'home/detail-insegn';
    this.routeAbsolutePath = 'home/summary';
    this.translate = new MyTranslatePipe(translateService);
    this.prefix = 'precontr';

    
    this.route.data.subscribe(data => {
      if (data.service === 'precontrattualedocente') {
        this.service = this.serviceDocente as any;
        this.prefix = 'precontrdocente';
      } 
    });

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
          { name: '', prop: 'insegn_id',  with: 100, maxWidth: 100, cellTemplate: this.comandi, sortable: false },
          { name: '#', prop: 'id', width: 80, maxWidth: 100 },
          { name: 'Copertura', prop: 'insegnamento.coper_id', width: 100, maxWidth: 100 },
          { name: 'Dipartimento', prop: 'insegnamento.dip_cod', cellTemplate: this.tooltipCellTemplate, width: 100, maxWidth: 150 },
          { name: 'Anno', prop: 'insegnamento.aa', width: 100, maxWidth: 150, pipe: this.translate },
          { name: 'Inizio', prop: 'insegnamento.data_ini_contr', width: 100, maxWidth: 150, type: 'date' },
          { name: 'Fine', prop: 'insegnamento.data_fine_contr', width: 100, maxWidth: 150, type: 'date' },
          { name: 'Cognome', prop: 'user.cognome', width: 150, maxWidth: 150 },
          { name: 'Nome', prop: 'user.nome', width: 150, maxWidth: 150 },
          { name: 'Motivo Atto', prop: 'insegnamento.motivo_atto', wrapper: 'value', pipe: this.translate, minWidth: 100, maxWidth: 150},
          { name: 'Insegnamento', prop: 'insegnamento.insegnamento', width: 450 },    
          { name: 'Codice insegnamento', prop: 'insegnamento.cod_insegnamento', width: 200 },          
          { name: 'Rapporto', prop: 'p2naturarapporto.natura_rapporto', pipe: this.translate, width: 200, maxWidth: 350 },
          { name: 'Stato corrente', prop: 'currentState', minWidth: 100 },
          { name: 'Tipo accettazione', prop: 'validazioni.tipo_accettazione', minWidth: 100 },
        ]
      },
      fieldArray: {
        fieldGroup: []
      }
    },
    // {
    //   template: "<div>Usa il tasto <span class='oi oi-external-link ms-1 me-1'></span> oppure doppio click sulla riga per accedere alla precontrattuale</div>",
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
