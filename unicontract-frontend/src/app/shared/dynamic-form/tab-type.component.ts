import { FieldType, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgbNavModule, NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { evalExpression } from './utils';
import ControlUtils from './control-utils';



// ng g c shared/dynamic-form/tab-type -s true  --spec false --flat true

//[disabled]="index>0 && !isValidChain(index-1)"
// <button class="btn btn-circle me-2">
// <span *ngIf="isActive(index)" class="oi oi-pencil iconic" aria-hidden="true"></span>
// <span *ngIf="!isActive(index)"><b>{{ index + 1 }}</b></span>
// </button>
// <span>{{ f.props.label }} </span>    
@Component({
    selector: 'app-tab-type',
    template: `
  <nav ngbNav #tabs="ngbNav" class="nav-pills" [orientation]="'horizontal'" (navChange)="onTabChange($event)"  [(activeId)]="activedStep">
  <ng-container *ngFor="let f of field.fieldGroup; let index = index;" [ngbNavItem]="index">    
      <ng-template ngbNavContent>
          <formly-field [field]="f"></formly-field>
      </ng-template>  
  </ng-container>
</nav>
<div [ngbNavOutlet]="tabs"></div>
<div class="btn-toolbar justify-content-between mb-4" role="toolbar">
<div class="btn-group" role="group">
<button  [style.visibility]="selectedTab !== 'tab-0' ? 'visible' : 'hidden'"  [disabled]="selectedTab == 'tab-0' || (!isValid(activedStep) && !isBozza())" class="btn btn-outline-primary rounded me-2" type="button" (click)="prevStep(activedStep)">Indietro</button>
</div>
<div class="btn-group" role="group">
<ng-container *ngFor="let f of field.fieldGroup; let index = index;">
<button type="button"    
    [style.visibility]="f.hide ? 'hidden' : 'visible'"
    [disabled]="buttonDisabled(activedStep,index)" 
    [className]="activedStep == index ? 'btn btn-success rounded me-1' : 'btn btn-outline-primary rounded me-1'" 
    title="{{ f.props.title ? f.props.title : ('btn_'+(field.key || '')+'_'+index+'_title' | translate) }}"
    (click)="setStep(index)">{{ 'btn_'+(field.key || '')+'_'+index | translate }}</button>
</ng-container>
</div>
<div class="btn-group" role="group">
<button  [style.visibility]="!last ? 'visible' : 'hidden'"  class="btn btn-outline-primary rounded me-1" type="button" [disabled]="!isValid(activedStep) || last" (click)="nextStep(activedStep)">Avanti</button>
<button *ngIf="to.label_btn_next_step && isBozza()"  class="btn btn-outline-primary rounded" type="button" (click)="nextStepAction(activedStep)">{{to.label_btn_next_step }}</button>
<button *ngIf="last && to.onSubmit" class="btn btn-outline-primary rounded" type="button" [disabled]="!form.valid || !form.dirty" (click)="to.onSubmit()">Salva</button>
</div>
</div>
  `,
    styleUrls: ['./wrapper/navstepper-wrapper.component.css'],
    standalone: false
})
//[disabled]=!form.dirty
//[disabled]="!isValid(activedStep)"

export class TabTypeComponent extends FieldType implements OnInit {

  activedStep = 0;

  @ViewChild('tabs', { static: true }) tabs: NgbNav;

  get last(): boolean {
    return this.activedStep === this.getLastVisibleIndex();
  }

  _selectedTab = 'tab-0';

  constructor(private cdr: ChangeDetectorRef) {
    super();    
  }

  ngOnInit() {          
  }

  ngAfterViewInit() {
    // Select the first tab
    // if (this.tabs) {
    //   this.tabs.select('tab-2'); // Replace 'tab-0' with the appropriate ID of the first tab
    // }
  }

  isBozza(){
    return this.options.formState.current_place && (this.options.formState.current_place == 'bozza' || this.options.formState.current_place == 'non_compilata');
  }

  isBozzaCompleta(){    
    return this.options.formState.current_place && this.options.formState.current_place == 'bozza_completa';
  }

  isActive(index): boolean {    
    return (index) == this.tabs.activeId;
    //return ('tab-' + index) === this.tabs.activeId;
  }

  buttonDisabled(activeStep, index){
    if (this.options.formState.current_place == 'bozza'){
      //un bottone per essere attivo deve avere il precedente valido
      //meglio se tutti i precedenti sono validi
      //se primo
      if (index == 0)
        return !this.isValid(index);
      else {
        return !this.isValid(index-1) || this.buttonDisabled(activeStep, index-1);
      }
    }
    return !this.isValid(activeStep);
  }

  getLastVisibleIndex(): number {
    for (let i = this.field.fieldGroup.length - 1; i >= 0; i--) {
      if (!this.field.fieldGroup[i].hide) {
        return i;
      }
    }
    return -1; // Return -1 if no visible fields are found
  }


  // isValidChain(index): boolean {
  //   if (!this.tabs.items)
  //     return true;
  //   //se uno dei tab precedenti è disabilitato allora mi disabilito
  //   for (let i = 0; i <= index; i++) {
  //     let t = this.tabs.items.find(x => x.id == 'tab-' + i)
  //     if (t.disabled)
  //       return false;
  //   }
  //   return this.isValid(index);
  // }

  isValid(index): boolean {
    let tab = this.field.fieldGroup[index];   
    return this.isValidFieldGroup(tab);
  }

  isValidFieldGroup(group: FormlyFieldConfig) {
    if (!group || !group.fieldGroup){
      return true;
    }

    for (let subfield of group.fieldGroup) {

      const fullName = this.field.key ? (this.field.key as string) + "." + (subfield.key as string): (subfield.key as string);
      const contrl = this.form.get(fullName);

      //chiamata alla funzione di hideExpression
      // const hideResult = !!evalExpression(
      //   subfield.hideExpression,
      //   { subfield },
      //   [subfield.model, this.formState],
      // );

      if (contrl) {
        if (contrl.status !== 'DISABLED') {
          if (contrl && !contrl.valid)
            return false;
        }
      }
      //allora il subfield è un fieldgroup                 
      if (subfield.fieldGroup)
        if (!this.isValidFieldGroup(subfield))
          return false;
    }

    return true;
  }

  prevStep(step) {
    if (step === 0)
      return;
    this.activedStep = step - 1;
    this.selectActiveStep();
  }

  /**
   * Next step action - salva e continua
   * to.nextStep: funzione definita dall'utente nel props che ritorna un observable
   * 
   * @param step step attivo
   */
  nextStepAction(step){   
    //lanciare evento per il salvataggio o chiamare una funzione registrata
    if (this.to.nextStep instanceof Function) {      
      if (this.isValid(step)){
        
        this.to.nextStep(step).subscribe(
          res => {
            this.nextStep(step);
          },
          err => {
            console.log(err);
          }
        );

      }else{
        console.log('Not valid');
        let tab = this.field.fieldGroup[step];
        //marca i rossi
        ControlUtils.validateWithTouched(tab);    
        
        this.to.nextStep(step).subscribe(
          res => {},
          err => {}
        );
      }
            
    } else {

    }    
  }

  /**
   * Next step
   * 
   * Imposta come attivo lo step successiovo se è l'ultimo allora ritorna true
   * 
   * @param step 
   * @returns  
   */
  nextStep(step) {
    //se ultimo
    if (step === this.field.fieldGroup.length - 1) {
      return true;
    }
   
    this.setStep(step+1);    
  }

  setStep(index){
    this.activedStep = index;
    this.selectActiveStep();
    this.cdr.detectChanges();
  }

  selectActiveStep() {
    this.selectedTab = this.activedStep+'';
    //console.log(this.activedStep);
    //this.tabs.activeId = this.activedStep;
    //this.tabs.select('tab-' + this.activedStep);
  }


  public get lastIndex(): string {
    return this.tabs.items.last.id; // 'tab-' + ( this.field.fieldGroup.length - 1);
  }

  public get selectedTab(): string {
    return this._selectedTab;
  }


  public set selectedTab(value: string) {
    this._selectedTab = value;
    this.activedStep = +value.replace('tab-', '');
  }


  getStepTitle(index) {
    let label = this.to.labels[index];
    if (label) {
      return label;
    }
    return 'Passo ' + index;
  }

// The nav change event emitted right before the nav change happens on user click.
// This event won't be emitted if nav is changed programmatically via [activeId] or .select().
  onTabChange($event) { 
    this.selectedTab = $event.nextId;    
  }

  onPopulate(field: FormlyFieldConfig){
    //possiamo caricare i dati di iniziali   
    if (field.props.getFirstValue){     
      field.fieldGroup = field.props.getFirstValue(field);      
    }
  }

  postPopulate(field: FormlyFieldConfig){       

  }
  
}