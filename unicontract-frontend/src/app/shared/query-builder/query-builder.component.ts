import { Component, OnInit, Input, OnChanges, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions, FormlyTemplateOptions } from '@ngx-formly/core';
import { FormGroup, FormArray, FormControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, startWith, tap } from 'rxjs/operators';
import { MessageService } from '../message.service';
import { Operator } from './query-builder.interfaces';
import { getLocaleExtraDayPeriodRules } from '@angular/common';
import ControlUtils from '../dynamic-form/control-utils';

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

  public defaultOperatorMap: {[key: string]: Operator[]} = {
    string: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'contiene', value:'contains'}],
    index: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'inizia per', value:'contains'}],
    textarea: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'contiene', value:'contains'}],
    number: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'maggiore', value:'>'}, {label:'maggiore uguale', value:'>='}, {label:'minore', value:'<'}, {label:'minore uguale', value:'<='}],
    time: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'maggiore', value:'>'}, {label:'maggiore uguale', value:'>='}, {label:'minore', value:'<'}, {label:'minore uguale', value:'<='}],
    date: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}, {label:'maggiore', value:'>'}, {label:'maggiore uguale', value:'>='}, {label:'minore', value:'<'}, {label:'minore uguale', value:'<='}],
    enum: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}], //['=', '!=', 'in', 'not in'],
    select: [{label:'uguale', value:'='}, {label:'diverso', value:'!='}], //['=', '!=', 'in', 'not in'],
    boolean: [{label:'uguale', value:'='}],
    selectrelation: [{label:'ha', value:'has'},{label:'non ha', value:'doesntHave'}]
  };

  fields: FormlyFieldConfig[] = [
    {
      key: 'rules',
      type: 'repeat',
      wrappers: ['accordion'],      
      templateOptions: {
        min: this.builderoptions ? this.builderoptions.min : null,
        label: 'Condizioni',    
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
                return model.fixcondition || false;
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
                return model.fixcondition || false;
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
                    if (this.keymetadata[selectedField] )                                  
                      field.templateOptions.options = this.getOperators(selectedField,field.model);  
                      if (op == undefined && field.templateOptions.options[0] !== undefined) 
                        field.formControl.setValue(field.templateOptions.options[0].value);    
                      else               
                        field.formControl.setValue(op);                                                    
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
                'type': (model: any, formState: any) => {  return !!model.field ? 
                  (this.keymetadata[model.field].type =='external' ? 'externalquery' : this.keymetadata[model.field].type)
                  : 'input'},
              },
              hooks: {
                onInit: (field) => {    
                  
                  let selectedField = field.model.field; // field.parent.formControl.get('field').value;
                  if (selectedField){
                    //field.formControl.reset();
                    field.type = this.keymetadata[selectedField].type =='external' ? 'externalquery' : this.keymetadata[selectedField].type;
                    field.wrappers = ['form-field'];
                    field.templateOptions.options = this.keymetadata[selectedField].templateOptions.options;
                    field.templateOptions.type = this.keymetadata[selectedField].templateOptions.type;
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
                        //restituiamo il tipo per esecuzione query
                        field.model.type = this.keymetadata[selectedField].type;
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

                        field.templateOptions.options = this.keymetadata[selectedField].templateOptions.options;
                        field.templateOptions.type = this.keymetadata[selectedField].templateOptions.type;
                        field.templateOptions.valueProp = this.keymetadata[selectedField].templateOptions.valueProp;
                        field.templateOptions.labelProp = this.keymetadata[selectedField].templateOptions.labelProp;                        
                        field.templateOptions.label = 'Valore'

                        field.templateOptions.disabled = false;
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
              return model.fixcondition || false;
            },
          },
        ]
      }
    }
  ];


  form = new FormGroup({});
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
    if (this.rules)
      Object.assign(this.model.rules, this.rules);

    if (this.builderoptions){
      this.fields[0].templateOptions.min = this.builderoptions.min;
    }

    let field = this.fields[0].fieldArray.fieldGroup[0]; 

    let options = new Array();
    this.metadata.forEach(element => {
      this.keymetadata[element.key] = element;
      //generare la select dei campi // array di options
      
      //se il campo non ha key e label allora non puo essere inserito
      if (element.key && element.templateOptions && element.templateOptions.label)
        options.push({value: element.key, label: element.templateOptions.label});          
    });
    field.templateOptions.options = options;  
    //this.model.rules.push({field: options[0].value})
  }

   // ----------OnChanges Implementation----------

   ngOnChanges() {
     this.operatorsCache={};
   }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  getOperators(field: string, rawmodel): Operator[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    //non eseguito quando l'operatore è in cache
    let operators = this.defaultEmptyList;
    const fieldObject = this.keymetadata[field];    
    let type = fieldObject.type;  
    rawmodel.type = fieldObject.type;
    
    if (type) {
      if (type === 'external')
        type = (fieldObject.templateOptions.type || 'string');
        
      if (type === 'input')
        type = (fieldObject.templateOptions.type || 'string');

      if (fieldObject.templateOptions.type && fieldObject.templateOptions.type=='index')
        type = (fieldObject.templateOptions.type || 'index');  

      operators = (this.defaultOperatorMap[type] || this.defaultEmptyList);
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      //TODO sistemare i tipi nullable da dove lo si vede? se non è required 
      // if (!fieldObject.templateOptions.required) {
      //   operators = operators.concat(['is null', 'is not null']);
      // }
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

    let fa = this.form.controls['rules'] as FormArray;
    
    for (let index = 0; index < fa.controls.length; index++) {
      const fg = fa.controls[index] as FormGroup;  
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
