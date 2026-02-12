import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

let uniqueId = 0;

@Component({
    selector: 'formly-wrapper-accordion',
    template: `  
  <div class="card">
    <h4 class="card-header">
      {{ to.label }}
      <button class="btn btn-sm btn-link float-end"
              type="button"
              [id]="buttonId"
              (click)="isCollapsed = !isCollapsed"
              [attr.aria-expanded]="!isCollapsed"
              [attr.aria-controls]="panelId"
              [attr.aria-label]="isCollapsed ? 'Chiudi sezione' : 'Apri sezione'">
        <span *ngIf="isCollapsed" class="oi oi-chevron-top"></span>
        <span *ngIf="!isCollapsed" class="oi oi-chevron-bottom"></span>
      </button>              
    </h4>

    <div [id]="panelId" 
         [ngbCollapse]="isCollapsed"
         role="region"
         [attr.aria-labelledby]="buttonId">
      <div class="card-body">
        <ng-container #fieldComponent></ng-container>
      </div>
    </div>
  </div>
  `,
    standalone: false
})
export class AccordionWrapperComponent extends FieldWrapper {
  public isCollapsed = false;
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) fieldComponent: ViewContainerRef;

  panelId = `collapse-${uniqueId}`;
  buttonId = `collapse-btn-${uniqueId}`;

  constructor(){
    super()
    uniqueId++;
  }
}