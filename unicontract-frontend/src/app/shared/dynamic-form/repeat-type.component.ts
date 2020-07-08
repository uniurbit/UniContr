import { Component, ChangeDetectorRef } from '@angular/core';
import { FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'formly-repeat-section',
  template: `  
  <div class="mb-2">  
    <div *ngIf="to.label">{{to.label}} </div> 
    <button *ngIf="!to.btnHidden" type="button" [disabled]="checkAddButtonDisability()" class="btn btn-sm btn-outline-primary rounded-lg" (click)="onAddNew()"  >              
      <span class="oi oi-plus"></span>
      <span class="ml-2">Aggiungi</span>
    </button>  
  </div>   
  <div *ngFor="let subfield of field.fieldGroup; let i = index;">
      <formly-group              
        [field]="subfield">              
      </formly-group>              
      <div *ngIf="!to.btnRemoveHidden" class="mb-2">
        <button *ngIf="!btnRemoveHiddenFunc(model[i])" type="button" class="btn btn-sm btn-primary rounded-lg" (click)="onRemoveRepeat(i)"  >              
          <span class="oi oi-trash"></span>  
          <span class="ml-2">Rimuovi</span>
        </button>
      </div>    
      <div *ngIf="subfield.template" [innerHTML]="subfield.template">                           
      </div> 
      <div *ngIf="to.template" [innerHTML]="to.template">                           
      </div>    
  </div>
  <div *ngIf="showError" class="invalid-feedback" [style.display]="'block'">
  <formly-validation-message [field]="field"></formly-validation-message>
  </div>
  `,
})

export class RepeatTypeComponent extends FieldArrayType {
  constructor(private cd: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.to.add = this.add.bind(this);
    this.to.remove = this.remove.bind(this);

    let count = 0;
    if (this.model)
      count = this.model.length;

    if (this.to.min && this.to.min > 0) {
      for (let index = count; index < this.to.min; index++) {
        setTimeout(() => { this.add(); }, 0);
      }
      this.cd.detectChanges();
    }
    
  }

  checkAddButtonDisability() {
    if (this.model)
      return this.to.disabled || //se il componente è disabilitato
        (!this.to.disabled && (this.to.max != null ? this.model.length == this.to.max : false));
    else
      return this.to.disabled;
  }

  onAddNew() {
    if (this.to.onAddInitialModel) {
      let init = this.to.onAddInitialModel();
      this.add(null, init);
    } else {
      this.add();
      this.cd.detectChanges();
    }
  }

  btnRemoveHiddenFunc(model) {
    if (this.to.btnRemoveHiddenFunc) {
      return this.to.btnRemoveHiddenFunc(model);
    }
    return false;
  }

  onRemoveRepeat(index) {
    if (this.to.onRemove) {
      let id = this.formControl.at(index).get('id').value;
      (this.to.onRemove(id) as Observable<any>).subscribe(
        data => { this.remove(index); },
        err => { },
      );
    } else {
      this.remove(index);
      this.cd.detectChanges();
    }
  }

  clearFormArray() {
    while (this.formControl.length !== 0) {
      this.remove(0);
    }
  }

}