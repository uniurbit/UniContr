import { Component, OnInit, Input, ViewChild, TemplateRef, KeyValueDiffers } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { Page, PagedData } from '../lookup/page';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { NgbStringAdapter } from 'src/app/NgbStringAdapter';

@Component({
  selector: 'app-tablelookup-type',
  template: `  

<ngx-datatable
  #table  class="bootstrap" 
  [messages]="{emptyMessage: 'NODATA' | translate, totalMessage: 'TOTAL' | translate, selectedMessage: false}"
  [rows]="model"
  [columns]="to.columns"
  [columnMode]="to.columnMode"
  [rowHeight]="to.rowHeight"   
  [headerHeight]="to.headerHeight"      
  [footerHeight]="to.footerHeight"
  [scrollbarH]="to.scrollbarH"    
  [scrollbarV]="to.scrollbarV"  
  [reorderable]="to.reorderable"    
  [externalSorting]="true"
  [selected]="to.selected"
  [selectionType]="'single'"
  (sort)="onSort($event)"
  (select)='onSelect($event)'
  (activate)='onEvents($event)'
  [externalPaging]="true"
  [count]="to.page.totalElements"
  [offset]="to.page.pageNumber"
  [limit]="to.page.size"
  (page)='setPage($event)'
  (reorder) = 'to.onReorder($event)'>     

  <!-- Row Detail Template -->
  <ngx-datatable-row-detail
    [rowHeight]="100"
    #myDetailRow
    (toggle)="onDetailToggle($event)"
  > 
  </ngx-datatable-row-detail>

</ngx-datatable>

<ng-template #expaderdetailcolumn let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
  <div style="padding-left:5px;">
    <a    
      [class.datatable-icon-right]="!expanded"
      [class.datatable-icon-down]="expanded"
      title="Espandi/Chiudi riga"
      (click)="toggleExpandRow(row)">      
    </a>                          
  </div> 
</ng-template>

`
})


export class TableLookupTypeComponent extends FieldArrayType {  

  @ViewChild('table', { static: true }) table: any;
  @ViewChild('expaderdetailcolumn', { static: true }) public expaderdetailcolumn: TemplateRef<any>;     

  adapter = new NgbStringAdapter();   

  constructor(private differs: KeyValueDiffers) {    
    super();          
  }
        
  ngOnInit() {      
    this.setPage({ offset: this.to.page.pageNumber ? this.to.page.pageNumber : 0, limit: this.to.page.size});

    if(this.to.detailRow){
      //template only getter
      //this.table.rowDetail.template = this.to.detailRow;
    }

    if (!('selected' in this.to)){
      Object.defineProperty(this.to,'selected',{
        enumerable: true,
        configurable: true,
        writable: true
      });
      this.to.selected= [];
    }


    //costruzione dinamica delle colonne partendo dai campi aggiunta eventuali proprietà 
    //di colonna all'interno delle template option dei campi

    //la generazione automatica parte dal template del campo ng-formly
    //dove si possono specificare le proprietà della colonna nel campo column (width, resizable...)
    //
    //cellTemplate accetta una stringa che è il nome del template da associare alla colonna
    //
    if (typeof this.to.columns == 'undefined'){
      //configurazione basata sulla dichiarazione delle colonne nel json 
      // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],          
      this.to.columns =  this.field.fieldArray.fieldGroup.map(el => {      
        
        let c = { 
          name: el.templateOptions.label, 
          prop: el.key,                                          
        }
        el.templateOptions.label = "";                   
        if ('column' in el.templateOptions){
          //copio tutte le proprietà relativa alla colonna 
          Object.keys(el.templateOptions.column).forEach(prop => {
            if (prop=='cellTemplate'){
              if (this[el.templateOptions.column.cellTemplate])
                c['cellTemplate'] = this[el.templateOptions.column.cellTemplate]
            }else{
              c[prop] = el.templateOptions.column[prop]
            }
          }
          );
        }
        return c;
      });      
    }  //fine costruzione dinamica

    //se c'è la riga di dettaglio aggiungere come prima colonna l'expander
    if (this.to.detailRow){
      this.to.columns = [
        {
          width: 50, 
          canAutoResize:false,
          cellTemplate: this.expaderdetailcolumn,
          resizable: false,
        },
        ...this.to.columns
      ]
    }

    
  }

  getFields( field: FormlyFieldConfig, column: TableColumn, rowIndex: number ) : any {         
    let result = field.fieldGroup[rowIndex].fieldGroup.find(f => f.key === column.prop);
    return result;
  }

  getModel(model, column: TableColumn, rowIndex): any {
    return model[rowIndex];
  }

  getDescendantProp(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

  onSort(event) {
    if (this.to.onSort){
      this.to.onSort(event);
    }else{
      const sort = event.sorts[0];      

      this.table.rows.sort((a , b) => {   
          const valuea = this.getDescendantProp(a,sort.prop);
          const valueb = this.getDescendantProp(b,sort.prop);
          if (valuea != null && valueb != null){             
            if (typeof valuea ===  "number" && typeof valueb === "number"){
                //return (valuea > valueb) * (sort.dir === 'desc' ? -1 : 1);  
                return ((valuea>valueb ? 1 : valuea<valueb ? -1 : 0) * (sort.dir === 'desc' ? -1 : 1));  
            } else if (event.column.type  && event.column.type == "date"){
              const da = this.adapter.fromModel(valuea);
              const db = this.adapter.fromModel(valueb);
              return (<any>new Date(da.year,da.month-1,da.day) - <any>new Date(db.year,db.month-1,db.day)) * (sort.dir === 'desc' ? -1 : 1);
            }    
            return (valuea.localeCompare(valueb) * (sort.dir === 'desc' ? -1 : 1));    
          }
      });        
    }

    this.table.offset = this.to.page.pageNumber; 
  }

  onSelect({ selected }) {
      //console.log('Select Event', selected, this.selected);
  }

  onEvents(event) {
    if (event.type == "dblclick" && typeof this.to.onDblclickRow !== "undefined"){
      this.to.onDblclickRow(event);    
    }
  }
  
  ngDoCheck() {    
     
  }
  
    /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo){    
    this.to.page.pageNumber = pageInfo.offset;
    this.to.onSetPage(pageInfo);      
  }


  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  toggleExpandRow(row) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
}
