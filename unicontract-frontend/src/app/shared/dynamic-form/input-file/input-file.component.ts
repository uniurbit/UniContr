import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FieldType, FormlyFieldConfig, FormlyConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-input-file',
  template: `      
    <div *ngIf="inputField" placement="top" ngbTooltip="{{ to.tooltip ? to.tooltip.content : null}}">
    <input *ngIf="type !== 'number' else numberTmp" [type]="type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
    <ng-template #numberTmp>
      <input type="number" [formControl]="formControl" class="form-control" [formlyAttributes]="inputField" [class.is-invalid]="showError">
    </ng-template>
    </div>
    <input #fileInput type="file" accept="{{to.accept}}" (change)="onFileChanged($event)" style="display: none">    
  `,
  styles: []
})
export class InputFileComponent extends FieldType implements OnInit{

  inputField: FormlyFieldConfig = null;
    
  @ViewChild('fileInput') public fileInput: ElementRef;  

  constructor() {
    super();         
  }

  ngOnInit() {        
      if (!this.to.accept) {
        this.to.accept = 'application/pdf';
      }
         
      this.field.templateOptions.addonRight.onClick = (to, fieldType, $event) => this.reset();      
      this.field.templateOptions.addonLeft.onClick = (to, fieldType, $event) => { 
          this.openDialogSelectFile();         
      }
    
      this.field.templateOptions.keyup = (field, event: KeyboardEvent) => {
        if (event.key == "F2") {
            this.openDialogSelectFile();
        }
      };          
      this.inputField = this.field;                   
  }

  onFileChanged(event) {
    let selFile = event.target.files[0] as File;
    if (selFile){
      this.inputField.formControl.setValue(selFile.name);           
      this.to.onSelected(...[selFile, this.field])
    }
  }

  reset() {    
    if (!this.to.disabled){
      this.inputField.formControl.markAsTouched();
      this.inputField.formControl.setValue(null);
      this.inputField.formControl.updateValueAndValidity();    
      this.inputField.formControl.markAsDirty();   

      this.fileInput.nativeElement.value = "";
      this.to.onSelected(...[null, this.field])                 
    }
  }

    
  onPopulate(field: FormlyFieldConfig) {

    if (field.templateOptions.addonRight)
      return;

    if (!field.templateOptions.accept) {
      field.templateOptions.accept = 'application/pdf';
    }

    field.wrappers= ['form-field','addons'];   
    field.templateOptions.addonRight = {
      class: 'btn btn-outline-secondary oi oi-delete d-flex align-items-center',
      onClick: (to, fieldType, $event) => this.reset(),      
    };    

    field.templateOptions.addonLeft= {
      class: 'btn btn-outline-secondary oi oi-folder d-flex align-items-center',
      onClick: (to, fieldType, $event) => { 
        this.openDialogSelectFile();
      }
    };      

  }

  protected openDialogSelectFile(){
    if (!this.to.disabled){
      if (!this.model.filename){
        this.fileInput.nativeElement.value = null;
      }
      this.fileInput.nativeElement.click(); 
    }
  }

  
}
