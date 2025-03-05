import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { DatePipe } from '@angular/common';
import { BaseResearchComponent } from 'src/app/shared';
import { Page } from 'src/app/shared/lookup/page';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { ContrUgovService } from 'src/app/services/contr-ugov.service';
import { annoAccademicoCorrente } from 'src/app/shared/dynamic-form/utils';

@Component({
  selector: 'app-list-contrugov-query',
  templateUrl: '../../../shared/base-component/base-research.component.html',
  styles: []
})
export class ListaContrugovQueryComponent extends BaseResearchComponent {
  enabledExport = false;
  translate: MyTranslatePipe; 

  fieldsRow: FormlyFieldConfig[] = [
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
      key: 'currentState',
      type: 'selectrelation',
      templateOptions: {
        label: 'Contratto in contabilità',
        required: true,
        options: [
          {value: 'compensidaemettere', label: 'Compensi da emettere'}, //tutti
          {value: 'ordinatividaemettere', label: 'Ordinativi da emettere'}, //tutti
          {value: 'compensioordinativiemettere', label: 'Compensi o ordinativi da emettere'}     
        ]
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
      key: 'user.name',
      type: 'string',
      templateOptions: {
        label: 'Nominativo docente (nome cognome)',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },

    {
      key: 'insegnamento.coper_id',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Copertura',
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
      key: 'p2naturarapporto.natura_rapporto',
      type: 'select',
      templateOptions: {
        label: 'Natura del rapporto',
        options: [
          { value: 'PRPR', label: this.translateService.instant('p3_radio1') },
          { value: 'COCOCO', label: this.translateService.instant('p3_radio2')},
          { value: 'PLAO', label: this.translateService.instant('p3_radio3') },
          { value: 'PTG', label: this.translateService.instant('p3_radio4') },
          { value: 'ALD', label: this.translateService.instant('p3_radio5') }
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
      key: 'flag_no_compenso',
      type: 'select',
      templateOptions: {
        label: 'Rinuncia al compenso',
        options: [
          { value: true, label: this.translateService.instant('txt_si') },
          { value: false,label: this.translateService.instant('txt_no')},
        ],
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
  
  ];

  keyValueRules: { [key: string]: any[]} = {
    'compensidaemettere' : [
      { field: "relazioniratecompenso", operator: "doesntHave", value: "num_rate", type: "selectrelation" },
    ],
    'ordinatividaemettere' :[
      { field: "compensi.ordinativi", operator: "doesntHave", value: "", type: "selectrelation" },
    ],        
    'compensioordinativiemettere': [
      { field: "relazioniratecompensoordinativo", operator: "doesntHave", value: "num_rate", type: "selectrelation" },     
    ]
  };

  keyValueInverseRules: { [key: string]: any[]} = {
    'compensidaemettere' : [
      { field: "relazioniratecompenso", operator: "has", value: "num_rate", type: "selectrelation" },
    ],    
    'ordinatividaemettere': [
      { field: "compensi.ordinativi", operator: "has", value: "", type: "selectrelation" },
    ],
    'compensioordinativiemettere': [
      { field: "relazioniratecompensoordinativo", operator: "has", value: "num_rate", type: "selectrelation" },     
    ]    
  };


  protected getRules(model) {
    if (model.rules) {
      let rulestmp = JSON.parse(JSON.stringify(model.rules)) as (Array<any>);
      const ruleState = rulestmp.filter(x => x.field == 'currentState');      
      if (ruleState) {
        ruleState.forEach(element => {
          rulestmp.splice(rulestmp.indexOf(element), 1);
          if (element.operator === 'has') {
            rulestmp  = rulestmp.concat(this.keyValueRules[element.value]);
          } else {
            rulestmp  = rulestmp.concat(this.keyValueInverseRules[element.value]);
          }
        });
       
      }
      return rulestmp;
    }
    return model.rules;
  }

  resultMetadata: FormlyFieldConfig[];
  @ViewChild('tooltip', { static: true }) tooltipCellTemplate: TemplateRef<any>;

  constructor(protected service: ContrUgovService, router: Router, route: ActivatedRoute, private translateService: TranslateService) {
    super(router, route);
    this.enabledExport = true;
    this.enableNew=false;
    // percorso usato per apertura doppio click
    // this.routeAbsolutePath = 'home/detail-insegn';
    this.routeAbsolutePath = 'home/summary';
    this.translate = new MyTranslatePipe(translateService);
    this.prefix = 'contrugov';

    this.initRule();

    if (this.rules == null){
      const year = annoAccademicoCorrente();
      this.rules = [{field: "insegnamento.aa", operator: "=", value: year, fixcondition: true}];
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

    this.resultMetadata = [ {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        headerHeight: 50,
        footerHeight: 50,
        label: 'Risultati Contratti Ugov',
        columnMode: 'force',
        scrollbarH: true,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: 'Id dg', prop: 'datibase.id_dg', width: 80, maxWidth: 80 },
          { name: 'Copertura', prop: 'id_siadi', width: 100, maxWidth: 100 },
          { name: 'Cognome', prop: 'precontr.user.cognome', width: 120, maxWidth: 150 },
          { name: 'Nome', prop: 'precontr.user.nome', width: 120, maxWidth: 150 },
          { name: 'Data inizio', prop: 'precontr.insegnamento.data_ini_contr', width: 100, maxWidth: 150, type: 'date' },
          { name: 'Data fine', prop: 'precontr.insegnamento.data_fine_contr', width: 100, maxWidth: 150, type: 'date' },
          { name: 'Dipartimento', prop: 'precontr.insegnamento.dip_cod', cellTemplate: this.tooltipCellTemplate, width: 100, maxWidth: 100 }, //"27605"
          { name: 'Anno', prop: 'datibase.anno_rif', width: 70, maxWidth: 70 },                    
          { name: 'Descrizione', prop: 'datibase.ds_dg', width: 450 },
          { name: 'Stato contabile', prop: 'datibase.stato_dg', pipe: this.translate, width: 80, maxWidth: 80 },
          { name: 'Num. rate', prop: 'num_rate', pipe: this.translate, width: 80, maxWidth: 80 },          
          { name: 'Compensi', prop: 'statocompensi', minWidth: 100, maxWidth: 150  },
          { name: 'Ordinativi', prop: 'statoordinativi', minWidth: 150 },        
        ]
      },
      fieldArray: {
        fieldGroup: []
      }
    }];

    if (result) {
      this.setResult(result);
    }

  }

  onDblclickRow(event) {
    this.setStorageResult();
    // , {relativeTo: this.route}       
    if (event.type === 'dblclick') {
      if (event.row.precontr && event.row.precontr.insegn_id) {
        // caso particolare mantenuto per compatibilità
        this.router.navigate([this.routeAbsolutePath, event.row.precontr.insegn_id]);
      } 
    }
  }

}
