import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig, Field } from '@ngx-formly/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from '../lookup/lookup.component';

@Component({
  selector: 'app-externalquery',
  template: `
  <div  *ngIf="codeField" class="form-group form-row" style="position: relative">         
  <div class="input-group"> 
    <input *ngIf="field.templateOptions.type !== 'number' else numberTmp" [type]="field.templateOptions.type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
    <ng-template #numberTmp>
      <input type="number" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
    </ng-template>          
    <div class="input-group-addon input-group-append"
      *ngIf="to.addonRight"
      [ngStyle]="{cursor: to.addonRight.onClick ? 'pointer' : 'inherit'}"
      (click)="addonRightClick($event)">
      <i class="input-group-text" [ngClass]="to.addonRight.class" *ngIf="to.addonRight.class"></i>
      <span *ngIf="to.addonRight.text" class="input-group-text">{{ to.addonRight.text }}</span>
    </div>     
  </div>
  </div>
  `,
  styles: []
})
export class ExternalqueryComponent extends FieldType implements OnInit {
  codeField: FormlyFieldConfig;
  constructor(private formlyConfig: FormlyConfig, private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {
    this.field.wrappers = [];
    if (this.codeField == undefined) {      
      let tmpfield = this.field;      

      tmpfield.templateOptions.keyup = (field, event: KeyboardEvent) => {
        if (event.key == "F4") {
          this.open();
        }
      };

      tmpfield.templateOptions.addonRight = {
        class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',
        onClick: (to, fieldType, $event) => this.open(),
      }

      this.codeField = tmpfield;
    }

  }


  open() {
    const modalRef = this.modalService.open(LookupComponent, {
      size: 'lg'
    })
    modalRef.result.then((result) => {
      this.setcode(result);
    }, (reason) => {
    });
    modalRef.componentInstance.entityName = this.to.entityName;
    modalRef.componentInstance.rules = this.to.rules ? this.to.rules : null;
  }

  setcode(data: any) {
    if (this.field.templateOptions.codeProp in data){
      this.codeField.formControl.setValue(data[this.field.templateOptions.codeProp]);    
      //this.codeField.templateOptions.description = data[this.field.templateOptions.descriptionProp];
    }
  }

  addonRightClick($event: any) {
    if (this.to.addonRight.onClick) {
      this.to.addonRight.onClick(this.to, this, $event);
    }
  }

}
