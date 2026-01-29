import { Component, OnInit, Input, ContentChild, TemplateRef, ViewChild, ContentChildren, QueryList } from '@angular/core';
import { UntypedFormGroup, FormControl, UntypedFormArray, NgForm, Validators } from '@angular/forms';
import { ControlBase } from './control-base';
import ControlUtils from './control-utils';

@Component({
    selector: 'app-control-generic-list',
    templateUrl: './control-generic-list.component.html',
    styles: [],
    standalone: false
})
export class ControlGenericListComponent implements OnInit {

  //controllo padre che descrive il FormArray
  @Input() control: ControlBase<UntypedFormArray>;
  //insieme di controlli che formano l'item dell'array
  @Input() controls: {[key: string]: ControlBase<any>};
  //la form contenitore
  @Input() form: UntypedFormGroup;
        
  @ContentChild(TemplateRef) itemTemplate:  TemplateRef<any>;
   
  metadata: ControlBase<any>[];

  constructor() { }

  ngOnInit() {
    this.metadata = Object.keys(this.controls)
      .map(prop => {
        return Object.assign({}, { key: prop} , this.controls[prop]);
      });

  }

  add(){
      let fa = this.form.get(this.control.key) as UntypedFormArray;
      fa.push(ControlUtils.toFormGroup(this.metadata));
  }
 
}
