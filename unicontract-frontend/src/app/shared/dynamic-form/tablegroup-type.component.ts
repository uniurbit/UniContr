import { Component, OnInit, Input, ViewChild, TemplateRef, KeyValueDiffers } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { TableColumn } from '@swimlane/ngx-datatable';
import { Router } from '@angular/router';
import { Page, PagedData } from '../lookup/page';
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';
import { DatatableRowDetailDirective } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-tablegroup-type',
  template: `  

<ngx-datatable
  #grouptable  class="bootstrap expandable" 
  [messages]="{emptyMessage: 'NODATA' | translate, totalMessage: 'TOTAL' | translate,  selectedMessage: false}"
  [rows]="model"
  [groupRowsBy]="to.groupRowsBy"
  [columns]="to.columns"
  [columnMode]="to.columnMode"
  [rowHeight]="to.rowHeight"   
  [headerHeight]="to.headerHeight"      
  [footerHeight]="to.footerHeight"
  [scrollbarH]="to.scrollbarH"    
  [scrollbarV]="to.scrollbarV"  
  [reorderable]="to.reorderable"    
  [selected]="to.selected"
  [selectionType]="'single'"
  [groupExpansionDefault]="to.groupExpansionDefault"
  [summaryRow]="to.enableSummary"
  [summaryPosition]="to.summaryPosition"
  [summaryHeight]="'auto'"
  (activate)='onEvents($event)'
>     


<ngx-datatable-row-detail  [rowHeight]="'auto'" #myDetailRow>
</ngx-datatable-row-detail>

<!-- Group Header Template -->
<ngx-datatable-group-header [rowHeight]="70" #myGroupHeader (toggle)="onDetailToggle($event)">
  <ng-template let-group="group" let-expanded="expanded" ngx-datatable-group-header-template>
    <div style="padding-left:5px;">
      <a    
        [class.datatable-icon-right]="!expanded"
        [class.datatable-icon-down]="expanded"
        title="Expand/Collapse Group"
        (click)="toggleExpandGroup(group)">
        <b>{{ getGroupHeaderTitle(group) }}</b>
      </a>                          
    </div>
  </ng-template>
</ngx-datatable-group-header>

</ngx-datatable>

<!-- Colonna per azioni -->
<ng-template #staterow let-row="row" let-value="value">
  <strong>{{ value }}</strong>
  <i class="pb-icon icon-edit"></i>
  <i *ngIf="row.canDelete == true" class="pb-icon icon-garbage"></i>
  <i *ngIf="row.canSend== true" class="pb-icon icon-send"></i>
</ng-template>


<!-- Colonna per aprire il dettaglio -->
<ng-template #colDetail let-row="row" let-expanded="expanded" ngx-datatable-cell-template>
  <a
    href="javascript:void(0)"
    [class.datatable-icon-right]="!expanded"
    [class.datatable-icon-down]="expanded"
    title="Expand/Collapse Row"
    (click)="toggleExpandRow(row)">
  </a>
</ng-template>

`
})

//<h1>Model</h1>
//<pre>{{ model | json }}</pre>

export class TableGroupTypeComponent extends FieldArrayType {  
  
  @ViewChild('grouptable') table: any;  
  @ViewChild('colDetail') colDetail: any;

  constructor(builder: FormlyFormBuilder, private differs: KeyValueDiffers) {    
    super(builder);        
  
  }
        
  ngOnInit() {      
    
    if (!('selected' in this.to)){
      Object.defineProperty(this.to,'selected',{
        enumerable: true,
        configurable: true,
        writable: true
      });
      this.to.selected= [];
    }

    if(this.to.headerColGroupTemplate){
      this.table.groupHeader.template = this.to.headerColGroupTemplate;
    }
  
    if (this.to.rowDetailTemplate){
      //aggiunta della colonna per aprire il dettaglio
      (this.to.columns as Array<any>).splice(0,0,{
        'maxwith': 50,
        'resisable': false,
        'sortable': false,
        'draggable': false,
        'canAutoResize':false,
        'cellTemplate': this.colDetail
      })
      //aggiunto il template della riga di dettaglio
      this.table.rowDetail.template = this.to.rowDetailTemplate;
    }

    if (typeof this.to.columns == 'undefined'){
      //configurazione basata sulla dichiarazione delle colonne nel json 
      // modalità implicità di costruzione delle colonne 
        // columns: [
        //   { name: 'Id', prop: 'id', width: 10},
        //   { name: 'Nome utente', prop: 'name' },
        //   { name: 'Email', prop: 'email' },
        // ],      
      //costruzione dinamica delle colonne partendo dai campi aggiunta eventuali proprietà 
      //di colonna all'interno delle template option dei campi
      //
      this.to.columns =  this.field.fieldArray.fieldGroup.map(el => {      
        
        let c = { 
          name: el.templateOptions.label, 
          prop: el.key,                                          
        }
        el.templateOptions.label = "";
                       
        return c;
      });
      
    }
    
  }

 
  onEvents(event) {
    if (event.type == "dblclick" && typeof this.to.onDblclickRow !== "undefined"){
      this.to.onDblclickRow(event);         
    }
  }
  
  ngDoCheck() {    
     
  }
  
  getGroupRowHeight(group, rowHeight) {
    let style = {};

    style = {
      height: (group.length * 40) + 'px',
      width: '100%'
    };

    return style;
  }

  toggleExpandGroup(group) {
    //console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }  

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  toggleExpandRow(row) {
    //console.log('Toggled Expand Row!', row);    
    this.table.rowDetail.toggleExpandRow(row);
  }

  getHeight(row: any, index: number): number {
    return 100;
  }

  getGroupHeaderTitle(group){
    if (this.to.groupHeaderTitle){
      return this.to.groupHeaderTitle(group)
    }
    //<b>Stato: {{group.value[0].state}}</b>
    return group.value[0];
  }

 }
