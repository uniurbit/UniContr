import { Component, OnInit, OnDestroy, Injector, ChangeDetectorRef } from '@angular/core';
import { FieldType, FormlyConfig, FormlyFieldConfig } from '@ngx-formly/core';
import { takeUntil, startWith, tap, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupComponent } from '../lookup/lookup.component';
import ControlUtils from './control-utils';
import { Router } from '@angular/router';

@Component({
    selector: 'app-external-type',
    template: `                

  <div  style="position: relative">
  <ngx-loading [show]="isLoading" [config]="{  fullScreen: false, backdropBorderRadius: '4px' }"></ngx-loading>    
    <div *ngIf="codeField" class="row mb-3" [class.has-error]="showError">               
      <div class="col-md-4" > 
      <div class="form-group"> 
        <label [attr.for]="id" class="form-control-label control-label" *ngIf="to.label">
          {{ to.label }}
          <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
        </label>
        <div class="input-group"> 
          <input *ngIf="field.props.type !== 'number' else numberTmp" [type]="field.props.type" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
          <ng-template #numberTmp>
            <input type="number" [formControl]="formControl" class="form-control" [formlyAttributes]="field" [class.is-invalid]="showError">
          </ng-template>                    
          <ng-container *ngIf="to.addonRights" > 
            <ng-container *ngFor="let item of to.addonRights; index as i;">    
              <button type="button" class="input-group-text" [disabled]="to.disabled && !item.alwaysenabled" 
                  title="{{item.text}}" [ngClass]="item.class" *ngIf="item.class"  (click)="addonRightClick($event,i)"></button>               
            </ng-container>
          </ng-container>          
        </div>
        <div *ngIf="showError">
        <small class="text-danger invalid-feedback" [style.display]="'block'" role="alert" [id]="validationId">
          <formly-validation-message [field]="field"></formly-validation-message>
        </small>             
        </div>       
        </div>
      </div>    

      <div class="col-md-8">    
        <Label *ngIf="descriptionField.props.label">{{ descriptionField.props.label }} </Label>
        <input type="text" class="form-control" [value]="extDescription"  readonly>    
      </div>    
      <small *ngIf="to.description" class="form-text text-muted">{{ to.description }}</small>
   </div>  
   </div> 
   
  `,
    styles: [],
    standalone: false
})

export class ExternalTypeComponent extends FieldType implements OnInit, OnDestroy {
  codeField: FormlyFieldConfig;
  descriptionField: FormlyFieldConfig;
  extDescription = null;
  onDestroy$ = new Subject<void>();
  service: ServiceQuery;
  isLoading = false;

  nodecode = false;

  constructor(private formlyConfig: FormlyConfig, private cdr: ChangeDetectorRef, private injector: Injector, private modalService: NgbModal, public activeModal: NgbActiveModal, protected router: Router) {
    super();
  }

  ngOnInit() {
    const servicename = ControlUtils.getServiceName(this.to.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;

    this.field.wrappers = [];
    this.field.props.
      keyup = (field, event: KeyboardEvent) => {
        if (event.key == "F4") {
          this.open();
        }
        if (event.key == "F2"){
          if (this.codeField.formControl.value && this.to.entityPath){
            this.router.navigate([this.to.entityPath,this.codeField.formControl.value]);
          }
        }
      };

    this.field.props.addonRights = [{
      class: 'btn btn-outline-secondary oi oi-eye d-flex align-items-center',
      alwaysenabled: false,
      text: 'Ricerca',
      onClick: (to, fieldType, $event) => this.open(),
    }];
    if (this.to.entityPath){
      //extra bottone sulla destra per aprire la gestione
      this.field.props.addonRights = [
        ...this.field.props.addonRights,
        {
          class: 'btn btn-outline-secondary oi oi-external-link d-flex align-items-center',    
          alwaysenabled: true,
          text: 'Apri gestione',    
          onClick: (to, fieldType, $event) => {this.openEntity()},
        }
      ];      
    }

    this.init();

    this.field.formControl.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.onDestroy$),
      tap(selectedField => {        
        if (!this.initdesc)
          return this.init();

        if ((this.field.props.type =="number" && this.formControl.value != null && !this.nodecode) || 
          (this.field.props.type != "number" && this.formControl.value && !this.nodecode)) { 
          this.isLoading= true;         
          this.service.getById(this.formControl.value).subscribe((data) => {            
            this.isLoading = false;
            if (data == null) {
              this.extDescription = null;
              this.formControl.setErrors({ notfound: true });
              return;
            }
            //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione            
            this.setresult(data);
            //this.cdr.detectChanges(); // Manually trigger change detection
          });

        } else {
          //codizione di empty
          this.extDescription = null;
        }
      }),
    ).subscribe();
    this.field.formControl.updateValueAndValidity();
    
    this.codeField = this.field;

    this.descriptionField = {
      type: 'string',
      wrappers: ['form-field'],
      props: {
        disabled: true,
        label: 'Descrizione'
      }
    }
    
  }

  private initdesc = false;
  init(){   
    //verifico in caso di cache e non se il modello è inizializzato
    if (!this.initdesc && (this.field.key as string) in this.model && this.model[(this.field.key as string)]){    
      this.initdesc = true;
      
      if (this.field.props.initdescription in this.model){      
        this.extDescription = this.model[this.field.props.initdescription];        
      }else if (typeof this.field.props.descriptionFunc === 'function'){        
          this.extDescription = this.field.props.descriptionFunc(this.model);    
      } else if (!this.extDescription){
        //far scattare la decodifica 
        this.isLoading = true;
        //this.formControl.value è vuoto non deve ricercare  
        this.service.getById(this.formControl.value).subscribe((data) => {
          this.isLoading = false;
          if (data == null) {
            this.extDescription = null;
            this.formControl.setErrors({ notfound: true });
            return;
          }
          //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
          this.setDescription(data);            
        });
      }
    } else {
      //caso vuoto
      this.initdesc = true;
      this.setDescription(null);
    }
    return this.initdesc;
  }

  setDescription(data: any) {
    if (typeof this.field.props.descriptionFunc === 'function'){
      this.extDescription = this.field.props.descriptionFunc(data);    
    } else if (data){
      //il parametro decriptionProp contiene il nome della proprità che contiene la descrizione
      if (this.field.props.descriptionProp in data){
        this.extDescription = data[this.field.props.descriptionProp];
        if (this.field.props.initdescription in this.model)
          this.model[this.field.props.initdescription] = data[this.field.props.descriptionProp];
      } 
    }else{
      if (this.field.props.initdescription in this.model)
      this.model[this.field.props.initdescription] = '';
    }     
  }

  setcode(data: any) {
    if (this.field.props.codeProp in data){
      if (this.codeField){
        this.codeField.formControl.setValue(data[this.field.props.codeProp]);
        this.field.formControl.markAsDirty();
      }
    }
  }

  setresult(result){    
    this.nodecode = true  
    this.setcode(result);
    this.setDescription(result);
    if (this.field.props.copymodel){
      
      Object.keys(result).forEach( x=> this.model[x] = result[x]);      
    }
    this.nodecode = false
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  open() {
    const modalRef = this.modalService.open(LookupComponent, {
      size: 'lg'
    })
    modalRef.result.then((result) => {
      if (result!=='new'){
        this.setresult(result);
      }else{
        this.openNewEnity();
      }
    }, (reason) => {
    });
    modalRef.componentInstance.entityName = this.to.entityName;
    modalRef.componentInstance.entityLabel = this.to.entityLabel;
    modalRef.componentInstance.rules = this.to.rules ? this.to.rules : null;
    modalRef.componentInstance.enableNew = this.to.enableNew == undefined ? true : this.to.enableNew;
  }

  openEntity(){
    if (this.codeField.formControl.value && this.to.entityPath){
      this.router.navigate([this.to.entityPath,this.codeField.formControl.value]);
    }
  }

  addonRightClick($event: any,i) {
    if (this.to.addonRights[i].onClick) {
      this.to.addonRights[i].onClick(this.to, this, $event);
    }
  }

  onPopulate(field: FormlyFieldConfig) {
    field.modelOptions.updateOn = 'blur';
  }

  openNewEnity(){
    if (this.to.entityPath){
      this.router.navigate([this.to.entityPath,'new']);
    }
  }

}
