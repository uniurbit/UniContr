import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormlyForm, FormlyFieldConfig } from '@ngx-formly/core';
import { FormArray, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from '@angular/common';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';

@Component({
    selector: 'app-salva-annulla-button',
    template: `
  <div class="form-footer text-end" *ngIf="formRef">
    <ng-container *ngxPermissionsOnly="['OP_DOCENTE','SUPER-ADMIN']">
      <button *ngIf="!isNew" class="btn btn-outline-secondary rounded me-1" type="button" 
        (click)="annulla()" title="{{ 'btn_annulla_title' | translate }}" >{{ 'btn_annulla' | translate }}</button>        
      <button class="btn btn-outline-secondary rounded me-1" type="submit" [disabled]="disabled()" 
        (click)="handleClick()" title="{{ caption+'_title' | translate }}" >{{ caption | translate }}</button>  
    </ng-container>
  </div>
  `,
    styleUrls: [],
    standalone: false
})


//ng g c components/barra-comandi/salvaAnnullaButton -s true --spec false -t true
export class SalvaAnnullaButtonComponent implements OnInit {
  
  @Input() formRef : UntypedFormGroup;
  @Output() valid = new EventEmitter<void>();
  @Input() isNew: boolean = false;

  @Input() fields: FormlyFieldConfig[];

  @Input() returnUrl = null;
  @Input() caption = 'btn_save';

  constructor(protected router: Router, protected location: Location, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if(!this.isNew){
      if (this.fields){
        this.fields.forEach(field => ControlUtils.validate(field));      
      }
    }
  }

  handleClick(){
    if (this.isNew){      
      if (this.formRef instanceof FormGroup) { 
        this.formRef.updateValueAndValidity();
      }      
      this.markFieldsAsDirty();      
      this.cdr.detectChanges();
      this.emitIfValid();
    }else{
      if (this.formRef instanceof FormGroup) { 
        this.updateAllControlsValidity(this.formRef);        
      }
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
      return !this.formRef.valid || !this.formRef.dirty;
    }
  }

    // Function to update validity for all controls
    updateAllControlsValidity(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(controlName => {
        const control = formGroup.get(controlName);
        if (control instanceof FormGroup) {
          this.updateAllControlsValidity(control); // Recursively handle nested FormGroups
        } else if (control instanceof FormArray) {
          control.controls.forEach(ctrl => {
            if (ctrl instanceof FormGroup) {
              this.updateAllControlsValidity(ctrl); // Recursively handle nested FormGroups in FormArray
            }            
            ctrl.updateValueAndValidity(); // Update each control in FormArray
          });
        }
        control.updateValueAndValidity(); // Update the individual control
      });
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
