import { ControlBase } from "..";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { getDocument } from "pdfjs-dist";
import { FormlyFieldConfig } from "@ngx-formly/core/lib/core";

export interface ResultParse{
  docnumber: string;
  converted: string;
}
export default class ControlUtils {

  static getServiceName(entityName: string) {
    return entityName + 'Service';
  }

  static toFormGroup(controls: ControlBase<any>[]) {
    let group: any = {};

    controls.forEach(ctrl => {
      if (ctrl.controlType === 'array') {
        group[ctrl.key] = new UntypedFormArray([]);
      } else {
        group[ctrl.key] = new UntypedFormControl(ctrl.value || '', this.mapValidators(ctrl.validation));
      }
    });
    return new UntypedFormGroup(group);
  }

  static normalizeArray<T>(array: Array<T>, indexKey: keyof T) {
    const normalizedObject: any = {}
    for (let i = 0; i < array.length; i++) {
      const key = array[i][indexKey]
      normalizedObject[key] = array[i]
    }
    return normalizedObject as { [key: string]: T }
  }

  static mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        if (validation === 'required') {
          formValidators.push(Validators.required);
        } else if (validation === 'min') {
          formValidators.push(Validators.min(validators[validation]));
        }
      }
    }
    return formValidators;
  }


  
  static render_page(pageData) {

    let render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: false,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: false
    }

    return pageData.getTextContent(render_options)
      .then(function (textContent) {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          }
          else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        return text;
      });
  }

  public static async parsePdf(data): Promise<ResultParse>{
    let text = '';
    const result: ResultParse = <ResultParse> {};    
    await getDocument({ data: data }).promise.then(async (doc) => {
      let counter: number = 1;
      counter = counter > doc.numPages ? doc.numPages : counter;

      for (var i = 1; i <= counter; i++) {
        let pageText = await doc.getPage(i).then(pageData => this.render_page(pageData));
        text = `${text}\n\n${pageText}`;      
      }                      
      let number = text.match(/[d|D]elibera n.?\s?([A-Za-z0-9\/]*)\s*\n/);
      if (number && number[1]){
        result.docnumber = number[1];
      }
      let data_emissione = text.match(/[r|R]iunione del giorno\s([0-9]{2}\/[0-9]{2}\/[0-9]{4})\s?/);
      if (data_emissione && data_emissione[1]){
        result.converted = data_emissione[1].replace(/\//g,'-');
      }            
    });
    return result;   
  }

  //date nel formato gg-mm-aaaa
  public static toDate(date: string): Date{
    const comp_date = date.split('-');      
    return new Date(Number.parseInt(comp_date[2]), Number.parseInt(comp_date[1])-1, Number.parseInt(comp_date[0]));
  }


  public static genderTranslate(sex){
    if (sex){
      return sex === 'M' ? 'o' : 'a';
    }
    return 'o';
  }

  public static validate(field: FormlyFieldConfig) {
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f) => ControlUtils.validate(f));
    }else{     
      if (field.key) 
        field.validation = {show: true};
    }
  }  

  public static validateWithTouched(field: FormlyFieldConfig) {
    if (!field) return;

    if (field.fieldGroup) {           
      field.fieldGroup.forEach((f) => ControlUtils.validateWithTouched(f));
    }
    //Nel caso del field type repatable che ha un fieldgroup ma deve essere valutato anche il controllo field.formcontrol.    
    if (field.key && field.formControl) {
      field.formControl.markAsTouched();
      field.formControl.markAsDirty();
      field.formControl.updateValueAndValidity(); // ensures validation state is refreshed
    }    
  }

  public static getField(key: string, fields: FormlyFieldConfig[]): FormlyFieldConfig {
    for (let i = 0, len = fields.length; i < len; i++) {
      const f = fields[i];
      if (f.key === key) {
        return f;
      }
      
      if (f.fieldGroup && !f.key) {
        const cf = ControlUtils.getField(key, f.fieldGroup);
        if (cf) {
          return cf;
        }
      }
    }
  }

}
