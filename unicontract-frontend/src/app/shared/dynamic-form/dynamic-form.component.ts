import { Component, OnInit, Input } from '@angular/core';
import { ControlBase } from './control-base';
import { UntypedFormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})
export class DynamicFormComponent implements OnInit {

  @Input() control: ControlBase<any>;
  @Input() form: UntypedFormGroup;
  get isValid() { return this.form.controls[this.control.key].valid; }
  
  constructor() {}

  ngOnInit() {
 
  }

}
