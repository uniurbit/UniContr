import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Page } from 'src/app/shared/lookup/page';
import { Router } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { MycurrencyPipe } from 'src/app/shared/pipe/custom.currencypipe';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';

@Component({
  selector: 'app-contrattiresult',
  templateUrl: './contrattiresult.component.html', 
  styles: []
})
export class ConvenzioniresultComponent implements OnInit {
  isLoading: boolean = false;

  //@ViewChild('detailRow') detailRow: TemplateRef<any>;
  @ViewChild('converter') converter: TemplateRef<any>;  
  @ViewChild('tooltip') tooltipCellTemplate: TemplateRef<any>;

  @Input() querymodel: any;
  @Input() postname = null;

  form = new FormGroup({});
  model = {
    data: new Array<any>(),
  };
  @Input() columns: [] = null;

  resultMetadata: FormlyFieldConfig[];

  currency = new MycurrencyPipe();
  titlecase = new TitleCasePipe()

  translate: MyTranslatePipe;

  orderColumn: String[];


  constructor(private service: PrecontrattualeService, private router: Router, private datePipe: DatePipe, private translateService: TranslateService) {
    this.translate = new MyTranslatePipe(translateService);
  }

  ngOnInit() {
       
    let baseColumns: Array<any> = [
      { name: '#', prop: 'id', width: 80, maxWidth: 100 },
      { name: 'Copertura', prop: 'insegnamento.coper_id', width: 100, maxWidth: 100 },
      { name: 'Dipartimento', prop: 'insegnamento.dip_cod', cellTemplate: this.tooltipCellTemplate, width: 100, maxWidth: 150 },
      { name: 'Inizio', prop: 'insegnamento.data_ini_contr', width: 100, maxWidth: 150 },
      { name: 'Fine', prop: 'insegnamento.data_fine_contr', width: 100, maxWidth: 150 },
      { name: 'Cognome', prop: 'user.cognome', width: 150, maxWidth: 150 },
      { name: 'Nome', prop: 'user.nome', width: 150, maxWidth: 150 },
      { name: 'Insegnamento', prop: 'insegnamento.insegnamento', width: 500},
    ]

    if (this.columns){
      baseColumns = baseColumns.concat(this.columns);
    }
    
    baseColumns = this.applyOrder(baseColumns);  

    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          //wrappers: ['accordion'],      
          templateOptions: {
            label: 'Risultati',   
            columnMode: 'force',
            headerHeight: 50,
            footerHeight: 50,            
            scrollbarH: false,             
            hidetoolbar: true, 
            //detailRow: this.detailRow,
            selected: [],                        
            page: new Page(25),       
            onDblclickRow: (event) => this.onDblclickRow(event),
            onSetPage: (pageInfo) => this.onSetPage(pageInfo),
            onReorder: (event) => this.onReorder(event),
            columns: baseColumns,
          },
          fieldArray: {
            fieldGroup: []
          }
        }
      ];
      
      this.orderColumn = baseColumns.map(x => x.name);

      this.querymodel['limit']= 10;     
      this.onFind(this.querymodel);
      
  }

  applyOrder(columns: Array<any>){
    if (this.postname){      
      this.orderColumn = JSON.parse(localStorage.getItem('order_'+this.postname));
      if (this.orderColumn && this.orderColumn.length>0)
      columns = columns.sort((a,b)=> {
        let A = a['name'];
        let B = b['name'];
        if (this.orderColumn.indexOf(A)>this.orderColumn.indexOf(B)){
          return 1;
        }else{
          return -1;
        }
      });      
    }
    return columns;
  }


  onReorder(event){ 
   
    let temp = this.orderColumn[event.newValue];
    this.orderColumn[event.newValue] = this.orderColumn[event.prevValue];
    this.orderColumn[event.prevValue] = temp;

    if (this.postname){
      localStorage.setItem('order_'+this.postname,JSON.stringify(this.orderColumn));
      console.log(this.orderColumn);
    }
            
  }

  array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);    
  };



  onDblclickRow(event) {
    if (event.type === 'dblclick') {
      if (event.row.insegn_id){        
        this.router.navigate(['home/summary', event.row.insegn_id]);
      }
    }
   
  }

  onSetPage(pageInfo){      
    if (pageInfo.limit)
      this.querymodel['limit']= pageInfo.limit;     
    if (this.model.data.length>0){
      this.querymodel['page']=pageInfo.offset + 1;     
      this.onFind(this.querymodel);
    }
  }

  onFind(model){
    this.querymodel.rules = model.rules;  
    if (model.orderBy){
      this.querymodel.orderBy = model.orderBy;
    }    

    this.isLoading = true;    
    //this.service.clearMessage();
    try{      
      this.service.query(this.querymodel).subscribe((data) => {
        const to = this.resultMetadata[0].templateOptions;
        this.isLoading = false;   
        this.model=  {
          data: data.data
        }

        to.page.totalElements = data.total; // data.to;
        to.page.pageNumber = data.current_page-1;
        to.page.size = data.per_page;        
        
      }, err => {
        this.isLoading=false;
        console.error('Oops:', err.message);
      });
    }catch(e){
      this.isLoading = false;
      console.error(e);
    }
  }

}
