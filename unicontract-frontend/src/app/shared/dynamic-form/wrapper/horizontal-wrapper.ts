import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-horizontal-wrapper',
  template: `
    <div class="form-group row">
      <label [attr.for]="id" class="col-sm-3 col-form-label" *ngIf="to.label">
        {{ to.label }}
        <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
      </label>
      <div class="col-sm-9">
        <ng-template #fieldComponent></ng-template>
      </div>
    </div>
  `,
})
export class FormlyHorizontalWrapper extends FieldWrapper {
  @ViewChild('fieldComponent', { read: ViewContainerRef, static: true }) fieldComponent: ViewContainerRef;
}