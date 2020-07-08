import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-generic-type',
  template: `
  <ng-container *ngFor="let f of field.fieldGroup">
    <ng-container [ngSwitch]="f.type">
      <formly-field *ngSwitchCase="'input'" [field]="f"></formly-field>
      <formly-field *ngSwitchCase="'string'" [field]="f"></formly-field>
      <formly-field *ngSwitchCase="'number'" [field]="f"></formly-field>
      <formly-field *ngSwitchCase="'select'" [field]="f"></formly-field>
      <formly-field *ngSwitchCase="'selectrelation'" [field]="f"></formly-field>
      <formly-field *ngSwitchCase="'textarea'" [field]="f"></formly-field>   
      <formly-field *ngSwitchCase="'externalquery'" [field]="f"></formly-field>   
      <formly-field *ngSwitchCase="'datepicker'" [field]="f"></formly-field>         
      <formly-field *ngSwitchCase="'date'" [field]="f"></formly-field>               
    </ng-container>
  </ng-container>
  `,
  styles: []
})
export class GenericTypeComponent extends FieldType implements OnInit {
  genericField: FormlyFieldConfig;  

  constructor(private formlyConfig: FormlyConfig){
    super();   
  }

  ngOnInit() {  
    
  }

}
