import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-mask-type',
  template: `
  <div class="input-group"> 
  <div class="input-group-prepend">
    <span class="input-group-text">€</span>
  </div>
  <input type='text' currencyMask class="form-control" [class.is-invalid]="showError"  [formControl]="formControl" [formlyAttributes]="field">   
  </div>  
  `,
  styles: []
})
export class FormlyMaskTypeComponent extends FieldType {
}
