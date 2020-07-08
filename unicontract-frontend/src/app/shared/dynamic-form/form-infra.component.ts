import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-form-infra',
  template: `
  <form [formGroup]="form">
  <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form">
    <button type="submit" class="btn btn-primary submit-button">Submit</button>
    <button type="button" class="btn btn-default" (click)="options.resetModel()">Reset</button>
  </formly-form>
  </form>
`,
  styles: []
})

export class FormInfraComponent implements OnInit {

  form = new FormGroup({});

  @Input()
  model: any = {};
  
  options: FormlyFormOptions = {
    formState: {
      isLoading: false,
    },
  };

  @Input()
  fields: FormlyFieldConfig[];
  
  constructor() { }

  ngOnInit() {
  }

}
