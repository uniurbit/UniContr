import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormlyFieldConfig, FieldArrayType } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-table-type',
  template: `
  <div class="btn-toolbar mb-2" role="toolbar" *ngIf="!to.hidetoolbar">
    <div class="btn-group btn-group-sm">    
        <button type="button" class="btn btn-outline-primary border-0 rounded-0" (click)="addFirst()"  >              
            <span class="oi oi-plus"></span>
            <span class="ml-2">Aggiungi</span>
        </button>    
        <button type="button" class="btn btn-outline-primary border-0 rounded-0" [disabled]="to.selected.length == 0" (click)="removeSelected()"  >              
            <span class="oi oi-trash"></span>  
            <span class="ml-2">Rimuovi</span>
        </button>
    </div>
</div>

<ngx-datatable
  #table  class="bootstrap" 
  [messages]="{emptyMessage: 'NODATA' | translate, totalMessage: 'TOTAL' | translate, selectedMessage: false}"
  [rows]="model"
  [columns]="to.columns"
  [columnMode]="to.columnMode"
  [rowHeight]="to.rowHeight"   
  [headerHeight]="to.headerHeight"      
  [footerHeight]="to.footerHeight"
  [limit]="to.limit"  
  [scrollbarH]="to.scrollbarH"      
  [reorderable]="to.reorderable"    
  [externalSorting]="true"
  [selected]="to.selected"
  [selectionType]="'single'"
  (sort)="onSort($event)"
  (select)='onSelect($event)'
  (activate)='onEvents($event)'>
  
  <!-- Row Detail Template -->
  <ngx-datatable-row-detail
    [rowHeight]="100"
    #myDetailRow
    (toggle)="onDetailToggle($event)"
  > 
  </ngx-datatable-row-detail>

    <ng-template #defaultcolumn ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" let-column="column" >
  <formly-field [field]="getField(field, column, rowIndex)"></formly-field>
  </ng-template>  

  <ng-template #valuecolumn ngx-datatable-cell-template let-rowIndex="rowIndex" let-value="value" let-row="row" let-column="column" >
  {{ value }}    
  </ng-template>  
</ngx-datatable>
  



<ng-template #expaderdetailcolumn let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
  <div style="padding-left:5px;">
    <a    
      [class.datatable-icon-right]="!expanded"
      [class.datatable-icon-down]="expanded"
      title="Expand/Collapse Row"
      (click)="toggleExpandRow(row)">      
    </a>                          
  </div> 
</ng-template>

`
})

// <h1>Model</h1>
// <pre>{{ model | json }}</pre>
export class TableTypeComponent extends FieldArrayType {  
  @ViewChild('table') table: any;

  @ViewChild('defaultcolumn') public defaultColumn: TemplateRef<any>;
  @ViewChild('valuecolumn') public valuecolumn: TemplateRef<any>;  
  @ViewChild('expaderdetailcolumn') public expaderdetailcolumn: TemplateRef<any>;  
    
  //descrizione delle colonne della tabella
  columns: TableColumn[];
  //selected = [];

  ngOnInit() {    

    if(this.to.detailRow){
      this.table.rowDetail.template = this.to.detailRow;
    }

    if (!('selected' in this.to)){
      Object.defineProperty(this.to,'selected',{
        enumerable: true,
        configurable: true,
        writable: true
      });
      this.to.selected= [];
    }

    if (typeof this.to.columns !== 'undefined'){
      //configurazione basata sulla dichiarazione delle colonne nel json 
      // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],
      this.to.columns.forEach(column =>  { 
        if (column.cellTemplate == undefined){
          column.cellTemplate = this.defaultColumn; 
          if (column.wrapper){
            if (column.wrapper=='value')
              column.cellTemplate = this.valuecolumn; 
          }                       
        }
        });

    } else{
      //costruzione dinamica delle colonne partendo dai campi aggiunta eventuali proprietà 
      //di colonna all'interno delle template option dei campi
      //
      this.to.columns =  this.field.fieldArray.fieldGroup.map(el => {      
        
        let c = { 
          name: el.templateOptions.label, 
          prop: el.key,                                  
          cellTemplate: this.defaultColumn                  
        }
        el.templateOptions.label = "";
         
        if ('column' in el.templateOptions){
          //copio tutte le proprietà relativa alla colonna 
          Object.keys(el.templateOptions.column).forEach(prop => {
            if (prop=='cellTemplate'){
              c.cellTemplate = this[el.templateOptions.column[prop]]
            }else{
              c[prop] = el.templateOptions.column[prop]
            }
          }
          );
        }

        return c;
      });
      
    }   
    
  }

  getField( field: FormlyFieldConfig, column: TableColumn, rowIndex: number ) : any {         
    let result = field.fieldGroup[rowIndex].fieldGroup.find(f => f.key === column.prop);
    return result;
  }

  getModel(model, column: TableColumn, rowIndex): any {
    return model[rowIndex];
  }

  onSort(event) {
    const sort = event.sorts[0];
    this.model.sort((a , b) => {   
        if (a[sort.prop] != null && b[sort.prop] != null){             
          if (typeof a[sort.prop] ===  "number"){
              return (a[sort.prop]>(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));  
          }    
          return (a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));    
        }
    });          

    this.formControl.patchValue(this.model);   
  }

  onSelect(selected) {
    if (this.to.onSelected){
      this.to.onSelected(selected);
    } 
  }

  onEvents(event) {
    if (event.type == "dblclick" && typeof this.to.onDblclickRow !== "undefined"){
      this.to.onDblclickRow(event);    
    }
  }


  addFirst(){    
    this.add();        
    this.formControl.markAsDirty();
  }

  removeSelected(){    
    let index = this.model.indexOf(this.to.selected[0])
    this.remove(index);
    this.formControl.markAsDirty();
    this.to.selected = [];       
  }

  ngDoCheck() {    
     
  }

  onDetailToggle(event) {

  }

  toggleExpandRow(row) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
}
