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
    styles: [],
    standalone: false
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

    this.fileselection.props['onSelected'] = (selFile) => this.onFileChanged(selFile);   
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

    if (!field.model[field.key as string]){
      field.model[field.key as string] = {};
    }
    //field.fieldGroupClassName = 'row'
    field.fieldGroup = [
      {
        key: field.props.filename || 'filename',
        type: 'fileinput',
        className: field.props.class ? field.props.class : "col-md-6",
        props: {          
          type: 'input',
          placeholder: 'Scegli file tipo pdf',
          accept: 'application/pdf',         
          required: field.props.required == undefined ? false : field.props.required,
        },
      },
      {
        key: field.props.filevalue || 'filevalue',
        type: 'pdfviewer',        //PdfTypeComponent
        className: field.props.class ? field.props.class : "col-md-12",
        props: {
          required: field.props.required == undefined ? false : field.props.required,
        },
      }
    ];
  }

}
