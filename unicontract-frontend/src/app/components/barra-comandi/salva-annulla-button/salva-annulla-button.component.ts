import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormlyForm, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';

@Component({
  selector: 'app-salva-annulla-button',
  template: `
  <div class="form-footer text-right" *ngIf="formRef">
    <ng-container *ngxPermissionsOnly="['OP_DOCENTE','SUPER-ADMIN']">
      <button *ngIf="!isNew" class="btn btn-outline-secondary rounded mr-1"  
        (click)="annulla()" title="{{ 'btn_annulla_title' | translate }}" >{{ 'btn_annulla' | translate }}</button>        
      <button class="btn btn-outline-secondary rounded mr-1"  [disabled]="disabled()" 
        (click)="handleClick()" title="{{ caption+'_title' | translate }}" >{{ caption | translate }}</button>  
    </ng-container>
  </div>
  `,
  styleUrls: [],
})


//ng g c components/barra-comandi/salvaAnnullaButton -s true --spec false -t true
export class SalvaAnnullaButtonComponent implements OnInit {
  
  @Input() formRef : FormGroup;
  @Output() valid = new EventEmitter<void>();
  @Input() isNew: boolean = false;

  @Input() fields: FormlyFieldConfig[];

  @Input() returnUrl = null;
  @Input() caption = 'btn_save';

  constructor(protected router: Router, protected location: Location) { }

  ngOnInit() {
    if(!this.isNew){
      if (this.fields){
        this.fields.forEach(field => ControlUtils.validate(field));      
      }
    }
  }

  handleClick(){
    if (this.isNew){
      this.markFieldsAsDirty();
      this.emitIfValid();
    }else{
      this.emitIfValid();
    }    
  }

  disabled(){
    if (this.isNew){    
      if (this.formRef.touched)
        return this.formRef.invalid;      
      else 
        return false;
    }else{
      return this.formRef.invalid || !this.formRef.dirty;
    }
  }




  private markFieldsAsDirty() {
    if (this.fields){
      this.fields.forEach(field => ControlUtils.validate(field));      
    }
    
    Object.keys(this.formRef.controls)
      .forEach(fieldName =>
        this.formRef.controls[fieldName].markAsTouched()        
      );
  }

  private emitIfValid() {
    if (this.formRef.valid) {
      this.valid.emit();
    }
  }

  annulla(){
    if (this.returnUrl){
      this.router.navigate([this.returnUrl]);
    } else {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }

  

}
