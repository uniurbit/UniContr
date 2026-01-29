import { Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { customCurrencyMaskConfig } from '../../shared.module';


@Component({
    selector: 'app-formly-mask-type',
    template: `
  <div class="input-group"> 
  <div class="input-group-prepend">
    <span class="input-group-text">€</span>
  </div>
  <input type='text' currencyMask [options]="currencyOptions" class="form-control" [class.is-invalid]="showError"  [formControl]="formControl" [formlyAttributes]="field">   
  </div>  
  `,
    styles: [],
    standalone: false
})
export class FormlyMaskTypeComponent extends FieldType {
  public currencyOptions = customCurrencyMaskConfig;
}
