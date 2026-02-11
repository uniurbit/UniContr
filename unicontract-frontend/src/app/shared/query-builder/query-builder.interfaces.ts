import { Observable } from "rxjs";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { MessageService } from "../message.service";
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";


export interface Operator{
  label: string;
  value: string;
}

export interface ServiceBase {
  getById(id: any):  Observable<any>;
  getMetadata(): FormlyFieldConfig[];
}
export interface ServiceQuery extends ServiceBase {    
    query(filters: any): Observable<any>;
    export(filters: any): Observable<any>;
    exportxls(filters: any): Observable<any>;
}
export interface IQueryMetadata extends ServiceBase {    
  getQueryMetadata(): FormlyFieldConfig[];
}

export interface ServiceEntity extends ServiceBase {      
  store(model: any, retrow: boolean): Observable<any>;
  update(model: any, id: any, retrow: boolean): Observable<any>;
  remove(id: any): Observable<any>;
  clearMessage();
  messageService: MessageService;
  confirmationDialogService: ConfirmationDialogService;
}


export interface RuleSet {
    condition: string;
    rules: Array<RuleSet | Rule>;
  }
  
  export interface Rule {
    field: string;
    value?: any;
    operator?: string;
    entity?: string;
  }

  export interface Option {
    name: string;
    value: any;
  }

  export interface Field {
    name: string;
    value?: string;
    type: string;
    nullable?: boolean;
    options?: Option[];
    operators?: string[];
    defaultValue?: any;
    defaultOperator?: any;
    entity?: string;
    validator?: (rule: Rule, parent: RuleSet) => any | null;
  }

  export interface FieldMap {
    [key: string]: Field;
  }

  export interface EntityMap {
    [key: string]: Entity;
  }

  export interface Entity {
    name: string;
    value?: string;
    defaultField?: any;
  }


export interface QueryBuilderConfig {
    fields: FieldMap;
    entities?: EntityMap;
    allowEmptyRulesets?: boolean;
    getOperators?: (fieldName: string, field: Field) => string[];
    getInputType?: (field: string, operator: string) => string;
    getOptions?: (field: string) => Option[];
    addRuleSet?: (parent: RuleSet) => void;
    addRule?: (parent: RuleSet) => void;
    removeRuleSet?: (ruleset: RuleSet, parent: RuleSet) => void;
    removeRule?: (rule: Rule, parent: RuleSet) => void;
  }
  

