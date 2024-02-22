import { Component, Injectable, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { NgxDatatableModule, DatatableComponent } from '@swimlane/ngx-datatable';
import { TableColumn } from '@swimlane/ngx-datatable';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { GridModel } from './grid-model'
import { ControlBase } from './control-base';
import { FormArray, FormGroup } from '@angular/forms';
import ControlUtils from './control-utils';

@Injectable()
@Component({
    selector: 'app-grid',
    templateUrl: './dynamic-table.component.html'
})
export class DynamicTableComponent<T> implements OnInit, OnDestroy {
    
    @ViewChild('textcolumn', { static: true }) public textcolumn: TemplateRef<any>;
    @ViewChild('datecolumn', { static: true }) public datecolumn: TemplateRef<any>;
    
    @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

    @Input() metadata: ControlBase<any>[];        
    

    _controls: FormArray
    @Input()
    set controls(controls: FormArray){
        this._controls = controls;
    };    
    get controls():FormArray{
        return this._controls;
    }
    

    _datarows: Array<any>
    @Input() 
    set datarows(datarows: Array<any>){
        this._datarows = datarows;
    };    
    get datarows(): Array<any>{
        return this._datarows;
    }
    
    //la form contenitore
    @Input() form: FormGroup;
    
    @Input() columnMode: any = "force";    
    @Input() rowHeight: any = "auto" ;    
    @Input() headerHeight: any ="40" ;  
    @Input() footerHeight: any ="40" ;  
    @Input() limit: any ="10" ;  
    @Input() scrollbarH: any = "true" ;     
    @Input() reorderable: any ="reorderable" ;             
    
    @Output() onFetchDataRequired = new EventEmitter<GridModel<T>>();

    //descrizione delle colonne della tabella
    columns: TableColumn[];
    //riga selezionata        
    selected = [];

    private isLoading: boolean = false;
    private currentPageLimit: number = 0;
    private pageLimitOptions = [
        {value: 10},
        {value: 25},
        {value: 50},
        {value: 100},
    ];

    constructor() {
    }

    ngOnInit(): void {

        this.columns =  this.metadata.map(el => {
            return { 
              name: el.label, 
              prop: el.key,        
              sortable: true,
              cellTemplate: this.getTemplateColumn(el), //el.key!=='id' ? this.getTemplateColumn(el) : null,
              width: el.key=='id' ? 100 : null
            }
        });  
    }

    //scelta del template per visualizzaze il componente
    private getTemplateColumn(el:ControlBase<any>): TemplateRef<any> {    
        switch (el.controlType) {
        case 'textbox':
            return this.textcolumn;
        case 'datepicker':        
            return this.datecolumn;        

        default:
            return this.textcolumn;
        }
    }

    getCellClass( rowIndex, column ) : any {     
        if (rowIndex<this.controls.length){
            let ctrl = this.controls.at(rowIndex).get(column.prop);        
            return {      
            'is-invalid': ctrl.invalid && (ctrl.dirty || ctrl.touched)
            };
        }
    }

    getControl( rowIndex, column ) : any {     
        if (rowIndex<this.controls.length){
            return this.controls.at(rowIndex).get(column.prop);                    
        }
    }


    ngOnDestroy(): void {
        
    }

    onSort(event) {
        const sort = event.sorts[0];
        this.controls.value.sort((a , b) => {                
            if (typeof a[sort.prop] ===  "number"){
                return (a[sort.prop]>(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));  
            }    
            return (a[sort.prop].localeCompare(b[sort.prop]) * (sort.dir === 'desc' ? -1 : 1));    
        });    
        this.controls.patchValue(this.controls.value);   
        this.datarows = [...this.controls.value]; 
    }
        
    onSelect({ selected }) {
        //console.log('Select Event', selected, this.selected);
    }

    add(){                 
        let control = ControlUtils.toFormGroup(this.metadata)   
        this.controls.push(control);
        //empty row 
        this.datarows.push(control.value);      

        this.datarows = [...this.datarows];
        this.controls.patchValue(this.datarows);

        this.table
    }

    remove(){

        let index = this.datarows.indexOf(this.selected[0])
        if (index>-1){                        
            this.datarows = [...this.controls.value];                   
            this.datarows.splice(index,1);

            this.controls.patchValue(this.datarows);    
            this.controls.removeAt(this.controls.length-1);             
        }
  
        this.table.bodyComponent.rowIndexes.forEach(element => {
            let e = element;
        });        
    
        this.selected = [];        
    }

    emptyControls() {
        while (this.controls.length > 0) {
          this.controls.removeAt(0);
        }
      }
    


}