import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
    selector: 'formly-wrapper-accordion',
    template: `  
    <div class="card">
      <h4 class="card-header">
        {{ to.label }}
        <button class="btn btn-sm btn-link float-end" type="button" (click)="isCollapsed = !isCollapsed" [attr.aria-expanded]="!isCollapsed" aria-controls="collapseExample">         
          <span *ngIf="isCollapsed" class="oi oi-chevron-top"></span>
          <span *ngIf="!isCollapsed" class="oi oi-chevron-bottom"></span>
        </button>              
      </h4>
      <div id="collapseExample" [ngbCollapse]="isCollapsed">
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
}