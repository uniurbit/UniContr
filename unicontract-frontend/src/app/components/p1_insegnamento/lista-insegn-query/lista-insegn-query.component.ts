import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { InsegnamentoService } from 'src/app/services/insegnamento.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { Page } from 'src/app/shared/lookup/page';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { InsegnUgovService } from 'src/app/services/insegn-ugov.service';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { TranslateService } from '@ngx-translate/core';
import { annoAccademicoCorrente } from 'src/app/shared/dynamic-form/utils';

@Component({
    selector: 'app-lista-insegn-query',
    templateUrl: '../../../shared/base-component/base-research.component.html',
    styles: [],
    standalone: false
})
export class ListaInsegnQueryComponent extends BaseResearchComponent {

  // 'coper_id',
  // 'ruolo',
  // 'insegnamento',
  // 'settore',
  // 'cod_settore',
  // 'cfu',
  // 'ore',
  // 'cdl',
  // 'data_ini_contr',
  // 'data_fine_contr',
  // 'ciclo',
  // 'aa',
  // 'dipartimento',
  // 'compenso',
  // 'tipo_contratto',
  // 'tipo_atto',
  // 'emittente',
  // 'motivo_atto',
  // 'num_delibera',
  // 'data_delibera',
  // 'cod_insegnamento',
  // 'stato',
  // 'storico',
  // 'user_role'

  @ViewChild('seleziona', { static: true }) seleziona: TemplateRef<any>;

  translate: MyTranslatePipe;
  datePipe = new DatePipe('it-IT');

  fieldsRow: FormlyFieldConfig[] = [    
    {
      key: 'AA_OFF_ID',
      type: 'select',
      props: {
        label: 'Anno',
        valueProp: 'value',
        labelProp: 'label',
        options: this.service.getAnniAccademici()
      }
    },
    {
      key: 'nome',
      type: 'string',
      props: {
        label: 'Nome',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'cognome',
      type: 'string',
      props: {
        label: 'Cognome',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'coper_id',
      type: 'input',
      props: {
        type: 'number',
        label: 'Copertura',
        required: true,
        column: { cellTemplate: 'valuecolumn'}
      }
    },
    {
      key: 'af_gen_des',
      type: 'string',
      props: {
        label: 'Insegnamento',
        required: true,
      }
    },
    // {
    //   key: 'dip_des',
    //   type: 'string',
    //   props: {
    //     label: 'Dipartimento',
    //     required: true,
    //   }
    // },
    {
      key: 'dip_cod',
      type: 'select',
      props: {
        label: 'Dipartimento',        
        options: [
          { value: '005019', label: this.translateService.instant('005019_disb') },
          { value: '004919', label: this.translateService.instant('004919_dispea')},
          { value: '004419', label: this.translateService.instant('004419_digiur') },
         // valueey: '004940'labelue: this.translateService.instant('004940_discui') },
          { value: '005579', label: this.translateService.instant('005579_discui') },
          { value: '004939', label: this.translateService.instant('004939_distum') },
          { value: '004424', label: this.translateService.instant('004424_desp') }
        ]      
      }
    },
    // {
    //   key: 'data_ini_contratto',
    //   type: 'date',
    //   props: {
    //     label: 'Data inizio',
    //     required: true,

    //   }
    // },
    // {
    //   key: 'data_fine_contratto',
    //   type: 'date',
    //   props: {
    //     label: 'Data fine',
    //     required: true,
    //   }
    // },
  ];

  resultMetadata: FormlyFieldConfig[];
  @ViewChild('tooltip', { static: true }) tooltipCellTemplate: TemplateRef<any>;

  builderoptions:  FormlyFieldProps = {
    min: 1
  };

  constructor(protected service: InsegnUgovService, router: Router, route: ActivatedRoute, private translateService: TranslateService) {
    super(router, route);
    this.enableNew = false;
    this.routeAbsolutePath = 'home/detail-insegn';
    this.translate = new MyTranslatePipe(translateService);
    this.prefix = 'insegn';

    this.initRule();
    
    if (this.rules == null){
      const year = annoAccademicoCorrente();
      this.rules = [{field: "AA_OFF_ID", operator: "=", value: year, fixcondition: true},
        ];
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
      props: {
        label: 'Seleziona insegnamento',
        columnMode: 'force',
        scrollbarH: true,
        page: page,        
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '#', prop: 'coper_id', wrapper: 'value', width: 80, maxWidth: 100 },
          { name: 'Dipartimento', prop: 'dip_cod', wrapper: 'value', cellTemplate: this.tooltipCellTemplate, width: 50, maxWidth: 120 },
          { name: 'Cognome', prop: 'cognome', pipe: new TitleCasePipe(), width: 100, maxWidth: 100 },
          { name: 'Nome', prop: 'nome', pipe: new TitleCasePipe(), width: 100, maxWidth: 100 },          
          { name: 'Inizio', prop: 'data_ini_contratto',  wrapper: 'value', width: 80, maxWidth: 150, type: 'date'},
          { name: 'Fine', prop: 'data_fine_contratto', wrapper: 'value',  width: 80, maxWidth: 150, type: 'date'},
          { name: 'Insegnamento', prop: 'af_gen_des', wrapper: 'value', minWidth:400, width: 400},
          { name: 'Motivo Atto', prop: 'motivo_atto_cod', wrapper: 'value', pipe: this.translate, minWidth: 100, maxWidth: 150},
          { name: '', prop: 'coper_id',  minWidth: 120, cellTemplate: this.seleziona, sortable: false },
        ]
      },
      fieldArray: {
        fieldGroup: []
      }
    }];

    if (result){
      this.setResult(result);
    }
    
  }

  private groupHeaderTitle(group) {
    return `${group.value[0].nominativo}`;
  }

  onDblclickRow(event) {

  }

  rowSelection(row) {
    this.setStorageResult();
    this.router.navigate(['home/ugov-insegn-detail', row.coper_id, row.aa_off_id]);
  }


}
