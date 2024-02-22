import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';
import { GridOptions } from 'ag-grid-community';
import { GridFormlyCellComponent } from './grid-formly-cell.component';

/*
* componete di wrapping ag-grid da utilizzare in modalità dati client buon editing ordinamento e filtro
* la paginazione server-side, menu contestuali a pagamento
*/

@Component({
  selector: 'formly-field-grid',
  template: `
    <div [ngStyle]="style">
      <ag-grid-angular
        #agGrid
        style="width: 100%; height: 100%"
        class="className"
        suppressColumnVirtualisation=true
        allowContextMenuWithControlKey=true
        [gridOptions]="gridOptions"        
        [rowData]="model"

        [pagination]="false"
        [paginationPageSize]="paginationPageSize"
        [paginationNumberFormatter]="paginationNumberFormatter"        

        (firstDataRendered)="onFirstDataRendered($event)">
      </ag-grid-angular>
    </div>
`,
})

export class GridTypeComponent extends FieldArrayType implements OnInit {
  @ViewChild('agGrid', { static: true }) agGrid: TemplateRef<any>;

  private gridApi;
  private gridColumnApi;

  public paginationPageSize;
  public paginationNumberFormatter;

  gridOptions: GridOptions;
  style: any = {};

  ngOnInit() {
    this.style = {
      width: this.to.width,
      height: this.to.height,
    };

    this.paginationPageSize = 10;
    this.paginationNumberFormatter = function(params) {
      return "[" + params.value.toLocaleString() + "]";
    };

    // map cell Renderer to Formly Component
    this.to.gridOptions.columnDefs.forEach(column => column.cellRendererFramework = GridFormlyCellComponent);

    // set grid options and context of the parent formly field
    const gridOptions: GridOptions = this.to.gridOptions || {};
    gridOptions.context = {
      parentField: this.field,
    };

    this.gridOptions = gridOptions;
  }

  onFirstDataRendered(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    //params.api.sizeColumnsToFit();
    this.autoSizeAll();
   

  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

}



/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */