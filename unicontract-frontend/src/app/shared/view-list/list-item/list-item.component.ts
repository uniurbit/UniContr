import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-list-item',
    template: `
  <div class="row">
    <div class="col-md-2 text-truncate" title="{{ label }}">{{ label }}:</div>
    <div class="col-md-10">
    <span [ngClass]="{ 'text-danger fw-bold': isUndefined(value) }">{{ value }}</span>
    <ng-content></ng-content>
    </div>  
  </div>
  `,
    styles: [],
    standalone: false
})
//style="font-weight: bold;"
export class ListItemComponent implements OnInit {

  @Input() label;
  @Input() value;

  constructor() { }

  ngOnInit() {
  }
  
  isUndefined(val: string | null | undefined): boolean {
    if (val === null || val === undefined || val === '') {
      return true;
    }
  
    const strVal = String(val).toUpperCase();
    return strVal.includes('NON DEFINITO');
  }
}
