import { FieldType, FieldArrayType, FormlyFormBuilder } from '@ngx-formly/core';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { evalExpression } from './utils';



// ng g c shared/dynamic-form/tab-type -s true  --spec false --flat true

//[disabled]="index>0 && !isValidChain(index-1)"
@Component({
  selector: 'app-tab-type',
  template: `
  <ngb-tabset #tabs="ngbTabset" type="pills" [orientation]="'horizontal'" [justify]="'justified'" (tabChange)="onTabChange($event)">
  <div *ngFor="let f of field.fieldGroup; let index = index;">
    <ngb-tab id="tab-{{index}}"  *ngIf="!f.templateOptions.hidden">
        <ng-template ngbTabTitle>
          <button class="btn btn-circle mr-2">
            <span *ngIf="isActive(index)" class="oi oi-pencil iconic" aria-hidden="true"></span>
            <span *ngIf="!isActive(index)"><b>{{ index }}</b></span>
          </button>
          <button class="btn btn-outline-primary border-0 rounded-0">{{ f.templateOptions.label }} </button>          
        </ng-template>
        <ng-template ngbTabContent>            
            <formly-field 
                [model]="model"
                [field]="f"
                [options]="options"
                [form]="form">
            </formly-field>              
        </ng-template>
    </ngb-tab>
</div>
</ngb-tabset>
<div>
<button *ngIf="selectedTab !== 'tab-0'" class="btn btn-primary mr-2" type="button" (click)="prevStep(activedStep)">Indietro</button>
<button *ngIf="!last" class="btn btn-primary" type="button" [disabled]="!isValid(activedStep)" (click)="nextStep(activedStep)">Avanti</button>
<button *ngIf="last && to.onSubmit" class="btn btn-primary" type="button" [disabled]="!form.valid || !form.dirty" (click)="to.onSubmit()">Salva</button>
</div>
  `,
  styleUrls: ['./wrapper/navstepper-wrapper.component.css']
})

export class TabTypeComponent extends FieldType implements OnInit {

  activedStep = 0;

  @ViewChild('tabs', { static: true }) tabs: NgbTabset;

  last = false;
  _selectedTab = 'tab-0';

  ngOnInit() {

  }

  isActive(index): boolean {
    return ('tab-' + index) === this.tabs.activeId;
  }

  isValidChain(index): boolean {
    if (!this.tabs.tabs)
      return true;
    //se uno dei tab precedenti è disabilitato allora mi disabilito
    for (let i = 0; i <= index; i++) {
      let t = this.tabs.tabs.find(x => x.id == 'tab-' + i)
      if (t.disabled)
        return false;
    }
    return this.isValid(index);
  }

  isValid(index): boolean {
    let tab = this.field.fieldGroup[index];
    return this.isValidFieldGroup(tab);
  }

  isValidFieldGroup(group: FormlyFieldConfig) {
    for (let subfield of group.fieldGroup) {

      const fullName = this.field.key ? this.field.key + "." + subfield.key : subfield.key;
      const contrl = this.form.get(fullName);

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

  nextStep(step) {
    if (step === this.field.fieldGroup.length - 1) {
      return true;
    }
    this.activedStep = step + 1;
    this.selectActiveStep();
  }

  selectActiveStep() {
    this.tabs.select('tab-' + this.activedStep);
  }


  public get lastIndex(): string {
    return this.tabs.tabs.last.id; // 'tab-' + ( this.field.fieldGroup.length - 1);
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

  onTabChange($event) {
    this.selectedTab = $event.nextId;
    if (this.lastIndex === this.selectedTab) {
      this.last = true;
    } else {
      this.last = false;
    }
  }
}