import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FieldType } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
@Component({
  selector: 'app-pdf-type-input',
  template: `
  <formly-group 
    [field]="field">  
  </formly-group>     
  `,
  styles: []
})
export class PdfTypeInputComponent  extends FieldType implements OnInit {

  constructor() {
    super();
  }
 
  fileselection: FormlyFieldConfig = null;
  pdfviewer: FormlyFieldConfig = null;

  ngOnInit() {
    this.fileselection = this.field.fieldGroup.find(x=>x.key == this.to.filename || x.key =='filename');
    this.pdfviewer = this.field.fieldGroup.find(x=>x.key == this.to.filevalue || x.key =='filevalue');

    this.fileselection.templateOptions['onSelected'] = (selFile) => this.onFileChanged(selFile);   
  }

  onFileChanged(event) {        
    this.field.formControl.markAsDirty();
    let selFile = event; //event.target.files[0] as File;
    
    if (this.to.onSelected)
      this.to.onSelected(selFile);

    if (selFile){      
      //load pdf 
      const reader = new FileReader();
      reader.onload = (e: any) => {    
        //console.log(e.target.result);              
        this.pdfviewer.formControl.setValue(encode(e.target.result));        
      }
      reader.readAsArrayBuffer(selFile); 
    }else{
      this.pdfviewer.formControl.setValue(null);        
    }
  }

  onPopulate(field: FormlyFieldConfig) {
    if (field.fieldGroup) {
      // already initialized
      return;
    }

    if (!field.model[field.key]){
      field.model[field.key] = {};
    }
    //field.fieldGroupClassName = 'row'
    field.fieldGroup = [
      {
        key: field.templateOptions.filename || 'filename',
        type: 'fileinput',
        className: field.templateOptions.class ? field.templateOptions.class : "col-md-6",
        templateOptions: {          
          type: 'input',
          placeholder: 'Scegli file tipo pdf',
          accept: 'application/pdf',         
          required: field.templateOptions.required == undefined ? false : field.templateOptions.required,
        },
      },
      {
        key: field.templateOptions.filevalue || 'filevalue',
        type: 'pdfviewer',        //PdfTypeComponent
        className: field.templateOptions.class ? field.templateOptions.class : "col-md-12",
        templateOptions: {
          required: field.templateOptions.required == undefined ? false : field.templateOptions.required,
        },
      }
    ];
  }

}
