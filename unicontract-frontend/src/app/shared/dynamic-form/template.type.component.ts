import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'formly-template',
  template: `
    <div [class]="field.className ? field.className : ''" [innerHtml]="to.template"></div>
  `,
})
export class FormlyFieldTemplate extends FieldType {}