import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions, FormlyTemplateOptions } from '@ngx-formly/core';
import { UntypedFormGroup, UntypedFormArray, FormControl, ValidationErrors } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { Operator } from './query-builder.interfaces';
import { getLocaleExtraDayPeriodRules } from '@angular/common';
import ControlUtils from '../dynamic-form/control-utils';


export interface IConfigQueryBuilder {
  wrappers: string[];
  label: string;
  showButton: boolean;
}
@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styles: []
})

export class QueryBuilderComponent implements OnInit, OnChanges {
  onDestroy$ = new Subject<void>();

  @Input() builderoptions: FormlyTemplateOptions = null;

  @Input() rules;

  @Output() find =  new  EventEmitter();

  @Input() config: IConfigQueryBuilder = {
    wrappers: ['accordion'],
    label: 'Condizioni',
    showButton: true
  };; 

  public defaultOperatorMap: {[key: string]: Operator[]} = {
    string: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'contiene', value:'contains'}],
    index: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'inizia per', value:'contains'}],
    textarea: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'contiene', value:'contains'}],
    number: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'maggiore', value:'>'}, {label:'maggiore uguale', value:'>='}, {label:'minore', value:'<'}, {label:'minore uguale', value:'<='}],
    time: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'maggiore', value:'>'}, {label:'maggiore uguale', value:'>='}, {label:'minore', value:'<'}, {label:'minore uguale', value:'<='}],
    date: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'maggiore', value:'>'}, {label:'maggiore uguale', value:'>='}, {label:'minore', value:'<'}, {label:'minore uguale', value:'<='}],
    enum: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}], //['=', '!=', 'in', 'not in'],
    select: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}], //['=', '!=', 'in', 'not in'],
    selectIn: [{label:'uguale', value:'In'}, {label:'diverso', value:'NotIn'}], //['=', '!=', 'in', 'not in'],
    boolean: [{label:'uguale', value:'='}],
    selectrelation: [{label:'ha', value:'has'},{label:'non ha', value:'doesnthave'}],
    buttonselection: [{label:'in', value:'In'}, {label:'non in', value:'NotIn'}],
    dateyear: [{label:'uguale', value:'year'}]
  };

  fields: FormlyFieldConfig[]; 


  form = new UntypedFormGroup({});
  options: FormlyFormOptions = {};
  model = {
    rules: new Array<any>(),    
  };
 
  //elenco dei metadati dell'entità di ingresso
  @Input() metadata: FormlyFieldConfig[] = []
  private keymetadata: { [index: string]: FormlyFieldConfig } = {}
  private operatorsCache: {[key: string]: { label: string, value:string }[]};
  private defaultEmptyList: any[] = [];
  // private defaultTemplateTypes: string[] = [
  //  'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];
  public isNew : boolean = true;


  constructor(public messageService: MessageService, private cd: ChangeDetectorRef) { }

  // ----------OnInit Implementation----------


  setField(field: any, selectedField: string){
    if (this.keymetadata[selectedField].type!=='external'){                                                        
      field.templateOptions.field = {                                         
        type: this.keymetadata[selectedField].type,        
        templateOptions: {
          ...this.keymetadata[selectedField].templateOptions,
          type: this.keymetadata[selectedField].type,                                                                      
        }
      }
      
    }else{
      field.templateOptions.field = {                                         
        type: 'externalquery',
        templateOptions: { ...this.keymetadata[selectedField].templateOptions }
      };
    }
  }
  
  

  ngOnInit() {   

    this.fields = [
      {
        key: 'rules',
        type: 'repeat',
        wrappers: this.config.wrappers,      
        templateOptions: {
          min: this.builderoptions ? this.builderoptions.min : null,
          label: this.config.label,    
          btnRemoveHidden: true,         
        },
        fieldArray: {
          fieldGroupClassName: 'row',   
          fieldGroup: [
            //campo
            {
              key: 'field',
              type: 'select',   
              className: "col-md-4",         
              templateOptions: {
                label: 'Campo',                   
                required: true
              },
              expressionProperties: {
                'templateOptions.disabled': (model: any, formState: any) => {
                  return (model && model.fixcondition) || false;
                },
              },      
            },    
            //operator    
            {
              key: 'operator',
              type: 'select',
              className: "col-md-2",            
              templateOptions: {
                label: 'Criterio',          
                required: true,
              },
              expressionProperties: {
                'templateOptions.disabled': (model: any, formState: any) => {
                  return (model && model.fixcondition) || false;
                },
              },
              hooks: {
                onInit: (field) => {                
                
                  field.form.get('field').valueChanges.pipe(
                    takeUntil(this.onDestroy$),   
                    startWith(field.model.field),              
                    tap(selectedField => {     
                      const op = field.model ? field.model.operator : undefined;                                
                      field.formControl.setValue('');
                      if (this.keymetadata[selectedField] !== undefined && this.keymetadata[selectedField] !== null){                            
                        field.templateOptions.options = this.getOperators(selectedField,field.model);  
                        if (op == undefined && field.templateOptions.options[0] !== undefined) 
                          field.formControl.setValue(field.templateOptions.options[0].value);    
                        else               
                          field.formControl.setValue(op);                                                            
                      }                
                    }),
                  ).subscribe();
                },
              },
            },
            //generico
            {            
                type: 'generic',
                className: "col-md-5",  
                fieldGroup: [{
                  key: 'value',
                  type: 'input',
                  templateOptions: {
                      label: 'Valore',
                      options: [],
                      required: true,
                      disabled: false,
                  },
                  hideExpression: (model, formstate, field) => {
                    return !model;
                  },
                  expressionProperties: {
                    //model.field non è chiave univoca per la determinazione del tipo di campo aggiunti $$1 o $$2 ... $$n per disambiguare
                    //poi in fase di query vengono eliminati i postfissi $$1 e $$2 ... $$n
                    'type': (model: any, formState: any, field) => {                        
                      return !!model.field ? 
                            (this.keymetadata[model.field].type =='external' ? 'externalquery' : this.keymetadata[model.field].type)
                            : 'input'
                    },
                  },
                  hooks: {
                    onInit: (field) => {    
                      
                      let selectedField = field.model.field; // field.parent.formControl.get('field').value;
                      if (selectedField){
                      
                        field.type = this.keymetadata[selectedField].type =='external' ? 'externalquery' : this.keymetadata[selectedField].type;
                        field.wrappers = ['form-field'];
                        //debug
                        // if (this.keymetadata[selectedField].templateOptions.options instanceof Observable){
                        //   (this.keymetadata[selectedField].templateOptions.options as Observable<any>).subscribe(x =>{
                        //     field.templateOptions.options = x;
  
                        //     console.log(x);
                        //   });
                        // }else{
                        field.templateOptions.options = this.keymetadata[selectedField].templateOptions.options;                      
                        field.templateOptions.compareWith = (o1, o2) => {
                          if (Array.isArray(o1) && Array.isArray(o2)) {
                            return this.compareArrays(o1, o2);
                          }

                          if (o1 === o2) {
                            return true;
                          }
                
                          return o1 && o2 && o1.value && o2.value && o1.value === o2.value;
                        },
                        // }
                        
                        field.templateOptions.type = this.keymetadata[selectedField].templateOptions.type;
                        field.templateOptions.disabled = this.keymetadata[selectedField].templateOptions.disabled;
                        if (this.keymetadata[selectedField].templateOptions.valueProp)
                          field.templateOptions.valueProp = this.keymetadata[selectedField].templateOptions.valueProp;
                        if (this.keymetadata[selectedField].templateOptions.labelProp)
                          field.templateOptions.labelProp = this.keymetadata[selectedField].templateOptions.labelProp;                        
                        field.templateOptions.label = 'Valore';
                      }else{
                        field.type = 'input';
                        field.wrappers = ['form-field'];
                        field.templateOptions.label = 'Valore';
                      }
                      
                      field.parent.formControl.get('field').valueChanges.pipe(
                        takeUntil(this.onDestroy$),
                        tap(selectedField => {
                        
                          if (this.keymetadata[selectedField]) {
                            field.formControl.reset();
                            field.type = this.keymetadata[selectedField].type;
                            field.wrappers = ['form-field'];
                            if (this.keymetadata[selectedField].type=='external'){      
                                field.type = 'externalquery';
                                  //extern
                                field.templateOptions.entityName = this.keymetadata[selectedField].templateOptions.entityName;
                                field.templateOptions.entityLabel = this.keymetadata[selectedField].templateOptions.entityLabel;
                                field.templateOptions.codeProp = this.keymetadata[selectedField].templateOptions.codeProp;
                                field.templateOptions.descriptionProp = this.keymetadata[selectedField].templateOptions.descriptionProp;
                            }                        
                            field.templateOptions.disabled = this.keymetadata[selectedField].templateOptions.disabled;
                            field.templateOptions.options = this.keymetadata[selectedField].templateOptions.options;
                            field.templateOptions.type = this.keymetadata[selectedField].templateOptions.type;
                            field.templateOptions.valueProp = this.keymetadata[selectedField].templateOptions.valueProp;
                            field.templateOptions.labelProp = this.keymetadata[selectedField].templateOptions.labelProp;                        
                            field.templateOptions.label = 'Valore'
  
                            //field.templateOptions.disabled = false;
                          }
                        }),
                      ).subscribe();
                    },
                  }
              }],
            },
            {
              type: 'button',
              className: 'col-md-1 mt-4 pt-2',
              templateOptions: {
                btnType: 'btn btn-danger oi oi-trash',
                title: 'Rimuovi',
                // icon: 'oi oi-data-transfer-download'
                onClick: ($event, model, field) => {
                  field.parent.parent.templateOptions.remove(parseInt(field.parent.key));
                },
              },
              hideExpression: (model: any, formState: any) => {
                return (model && model.fixcondition) || false;
              },
            },
          ]
        }
      }
    ];


    if (this.rules)
      Object.assign(this.model.rules, this.rules);

    if (this.builderoptions){
      this.fields[0].templateOptions.min = this.builderoptions.min;
    }

    let field = (this.fields[0].fieldArray as FormlyFieldConfig).fieldGroup[0]; 

    let options = new Array();
    this.metadata.forEach(element => {
      //esistono vari filtri con la stessa chiave ma con tipo diverso o label diversa 
      //per disanbiguare mantenendo alla chiave viene aggiunto un $$1 o $$2 ...
      this.keymetadata[element.key as string] = element;
      //generare la select dei campi // array di options
      
      //se il campo non ha key e label allora non puo essere inserito
      if (element.key && element.templateOptions && element.templateOptions.label)
        options.push({value: element.key, label: element.templateOptions.label});                  
    });
    field.templateOptions.options = options;  
    this.cd.detectChanges();
    //this.model.rules.push({field: options[0].value})
  }

  //compare two arrays of string if they are equal    
  compareArrays(array1: string[], array2: string[]): boolean {
    if (array1.length !== array2.length) {
        return false;
    }   
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }
    return true;
  }

   // ----------OnChanges Implementation----------

   ngOnChanges() {
     this.operatorsCache={};
   }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // getOptions(operators: string[]) : Operator[] {
  //   return operators.map(el=> {                         
  //     return  {                          
  //       label: el,
  //       value: el
  //     };                  
  //   });
  // }

  getOperators(field: string, rawmodel): Operator[] {
  
    const fieldObject = this.keymetadata[field];    
    let type = fieldObject.type;  
    //effetto collaterale per impostare il type al modello di risposta
    rawmodel.type = fieldObject.type;

    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
     //non eseguito quando l'operatore è in cache
     let operators = this.defaultEmptyList;
    
    if (type) {
      if (type === 'external')
        type = (fieldObject.templateOptions.type || 'string');
        
      if (type === 'input')
        type = (fieldObject.templateOptions.type || 'string');

      if (fieldObject.templateOptions.type && fieldObject.templateOptions.type=='index')
        type = (fieldObject.templateOptions.type || 'index');  

      operators = (this.defaultOperatorMap[type as string] || this.defaultEmptyList);
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      //TODO sistemare i tipi nullable da dove lo si vede? se non è required 
      if (!fieldObject.templateOptions.required) {
        operators = operators.concat(['is null', 'is not null']);
      }
    } else {
      console.warn(`No 'type' property found on field: '${field}'`);
    }

    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[field] = operators;
    return operators;
  }

  onFind() {   
    ControlUtils.validate(this.fields[0]);
    if (!this.form.invalid){
      this.isNew = true;
      this.find.emit(this.model);
    }else{
      this.isNew = false;
      this.messageService.clear();
      //this.messageService.error("Condizioni di ricerca non valide");         
      //this.getFormValidationErrors();            
    } 
    return null;
  }

  disabled(){
    if (this.isNew){
      return false;
    }else{
      if (this.form.valid){
        this.isNew = true;
      }
      return !this.form.valid;
    }
  }

  /**
   * Gets form validation errors
   * Estrae e logga tutti i codici die errore della form
   */
  getFormValidationErrors() {      

    let fa = this.form.controls['rules'] as UntypedFormArray;
    
    for (let index = 0; index < fa.controls.length; index++) {
      const fg = fa.controls[index] as UntypedFormGroup;  
      Object.keys(fg.controls).forEach(key => {    
      const controlErrors: ValidationErrors = fg.get(key).errors;      
      if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {                        
            //this.messageService.error("Condizioni di ricerca non valide");    
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    
    }
  }
}
