import { Component, EventEmitter, OnDestroy, Injector } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { Subject, of, Observable } from 'rxjs';
import { takeUntil, startWith, filter, debounceTime, distinctUntilChanged, switchMap, tap, map, catchError } from 'rxjs/operators';
import ControlUtils from './control-utils';
import { ServiceQuery } from '..';

@Component({
    selector: 'formly-field-typeahead',
    template: `  
  <div class="form-group"> 
    <label [attr.for]="id" class="form-control-label control-label" *ngIf="to.label">
      {{ to.label }}
      <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
    </label>
    <ng-select class="custom"
      [items]="options$ | async"
      [placeholder]="to.placeholder"
      [typeahead]="search$"     
      [loading]="loading"
      loadingText = "Caricamento..."
      typeToSearchText = "Scrivi per ricercare"
      bindLabel="descrizione"
      bindValue="matricola"      
      [formControl]="formControl">
    </ng-select>
    <div *ngIf="showError">
    <small class="text-danger invalid-feedback" [style.display]="'block'" role="alert" [id]="validationId">
      <formly-validation-message [field]="field"></formly-validation-message>
    </small>
    </div>
    </div>
  `,
    standalone: false
})
export class FormlyFieldTypeahead extends FieldType implements OnDestroy {
  onDestroy$ = new Subject<void>();
  search$ = new EventEmitter();
  options$: Observable<any> = of([]);
  //binding items in ng-select  
  data: Array<any>;
  //richiesta server
  result: any;

  service: ServiceQuery;

  querymodel = {
    limit: 200,
    rules:  [{
      'field': null,
      'operator': 'contains',
      'value': null,      
    }],        
  };

  loading = false;

  constructor(private injector: Injector) {
    super();
  }

  ngOnInit() {
    const servicename = ControlUtils.getServiceName(this.to.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;
    this.querymodel.rules[0].field = this.to.field;
    
    this.options$ = this.search$.pipe(
      takeUntil(this.onDestroy$),     
      filter(v => v !== null && !this.loading),
      debounceTime(200),
      distinctUntilChanged(),      
      switchMap(term => {
        if (!term || term === '' || term.toString().length < 3)
        { 
          //chiude le precedenti ricerche 
          this.loading = false
          this.querymodel.rules[0].value = null;
          return of([]);
        }            

        if (term.toString().length <= 3){
          //chiude le precedenti ricerche
          this.loading = false
          //memorizzare o meno il term? dipende da dove vieni           
          return this.options$;
        }

       
        if (!this.loading && this.querymodel.rules.length > 0 && term.toString().search(this.querymodel.rules[0].value)>-1){
          //chiudi le precedenti ricerche e rimani con l'elenco corrente
          if (this.result){
            return of(this.result.filter(v => v.descrizione.toLowerCase().indexOf(term.toString().toLowerCase()) > -1));
          }else{
            return this.options$;
          }          
          //return this.data.filter(v => v.toLowerCase().indexOf(term.toString().toLowerCase()) > -1);
        }

        this.querymodel.rules[0].value = term;
        this.loading = true;

        return this.service.query(this.querymodel).pipe(
          catchError(() => { this.loading = false; return of(false); }), // empty list on error
          tap((res) => {
            this.loading = false; 
            this.result = res.data;
          }),          
          map(res => {
            if (res.data){
              return res.data;
            }
          })
        );
      }),
    );
    
  }

  public remoteSearch$(term)
  { 
    //observableOf(states.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
  }

  ngOnDestroy() {
    this.onDestroy$.complete();
  }
}