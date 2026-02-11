import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { FieldType, FormlyFieldConfig, FormlyConfig, FieldTypeConfig } from '@ngx-formly/core';

@Component({
    selector: 'app-input-file',
    template: `
  <div class="input-group" *ngIf="field" placement="top" ngbTooltip="{{ to.tooltip ? to.tooltip.content : null }}">
  <button class="btn btn-outline-secondary oi oi-folder  d-flex align-items-center" type="button" (click)="openDialogSelectFile()"></button>
  <input type="input" class="form-control" [formControl]="formControl" [formlyAttributes]="field">
  <button class="btn btn-outline-secondary oi oi-delete" type="button" (click)="reset()"></button>
  </div>
  <input #fileInput type="file" [accept]="props.accept" (change)="onFileChanged($event)" style="display: none">
  `,
    standalone: false
})
export class InputFileComponent extends FieldType<FieldTypeConfig>  implements OnInit{

  inputField: FormlyFieldConfig = null;
    
  @ViewChild('fileInput', { static: true }) public fileInput: ElementRef;  

  constructor() {
    super();         
  }

  ngOnInit() {        
      if (!this.props.accept) {
        this.props.accept = 'application/pdf';        
      }
             
      this.field.props.keyup = (field, event: KeyboardEvent) => {
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
      //let $img = this.fileInput.nativeElement.files[0];      
      this.props.onSelected(...[selFile, this.field])

    }
  }

  reset() {    
    if (!this.props.disabled){
      this.inputField.formControl.markAsTouched();
      this.inputField.formControl.setValue(null);
      this.inputField.formControl.updateValueAndValidity();    
      this.inputField.formControl.markAsDirty();   

      this.fileInput.nativeElement.value = "";
      this.props.onSelected(...[null, this.field])                 
    }
  }

    
  onPopulate(field: FormlyFieldConfig) {

    if (!field.props.accept) {
      field.props.accept = 'application/pdf';
    }

    // //field.wrappers= ['form-field','addons']; //.concat(this.field.wrappers),    
    // field.props.addonRight = {
    //   class: 'btn btn-outline-secondary oi oi-delete d-flex align-items-center',
    //   onClick: (to, fieldType, $event) => this.reset(),      
    // };    

    // field.props.addonLeft= {
    //   class: 'btn btn-outline-secondary oi oi-folder d-flex align-items-center',
    //   onClick: (to, fieldType, $event) => { 
    //     this.openDialogSelectFile();
    //   }
    // };      

  }

  protected openDialogSelectFile(){
    if (!this.props.disabled){
      if (!this.model.filename){
        this.fileInput.nativeElement.value = null;
      }
      this.fileInput.nativeElement.click(); 
    }
  }

  
}
