import { Component, OnInit, Input, ViewChild, TemplateRef, KeyValueDiffers } from '@angular/core';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder, FieldGroupTypeConfig } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';

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
  [selectionType]="to.selectionType ? to.selectionType : 'single'"  
  [displayCheck]="to.displayCheck ? to.displayCheck : null"
   

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

//<h1>Model</h1>
//<pre>{{ model | json }}</pre>

export class TableLookupTypeComponent extends FieldArrayType {  

  @ViewChild('table', { static: true }) table: any;
  @ViewChild('expaderdetailcolumn', { static: true }) public expaderdetailcolumn: TemplateRef<any>;     

  constructor(private differs: KeyValueDiffers) {    
    super();          
  }
        
  ngOnInit() {      
    this.setPage({ offset: this.to.page.pageNumber ? this.to.page.pageNumber : 0, limit: this.to.page.size});

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
      const field = this.field.fieldArray as FormlyFieldConfig;
      this.to.columns =  field.fieldGroup.map(el => {      
        
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
    const sort = event.sorts[0];
    this.model.sort((a , b) => {   
        const valuea = this.getDescendantProp(a,sort.prop);
        const valueb = this.getDescendantProp(b,sort.prop);
        if (valuea != null && valueb != null){             
          if (typeof valuea ===  "number"){
              return ((valuea>valueb ? 1 : valuea<valueb ? -1 : 0) * (sort.dir === 'desc' ? -1 : 1));  
          }    
          return (valuea.localeCompare(valueb) * (sort.dir === 'desc' ? -1 : 1));    
        }
    });          

    this.formControl.patchValue(this.model);   
  }

  onSelect({ selected }) {
    if (this.to.selected){
      this.to.selected.splice(0, this.to.selected.length);
      this.to.selected.push(...selected);
      
      if (typeof this.to.onSelect === 'function') {
        this.to.onSelect(this.field, selected);
      }       
      this.formControl.markAsTouched();
      this.formControl.updateValueAndValidity();      
    }    
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
