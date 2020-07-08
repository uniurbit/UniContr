import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-button',
  template: `
    <div>
      <button [type]="to.type" title="{{to.title}}" [ngClass]="'btn btn-' + to.btnType" [disabled]="to.disabled" (click)="onClick($event)">
        <span *ngIf="to.icon" class="{{to.icon}}"></span>  
        <span *ngIf="to.text" class="ml-2">{{ to.text }}</span>          
      </button>
    </div>
  `,
})
export class FormlyFieldButton extends FieldType {
  onClick($event) {
    if (this.to.onClick instanceof Function) {      
      //(this.to.onClick as Function).apply(this.field, [$event, this.model]);
      this.to.onClick($event, this.model, this.field);
    }
  }
}