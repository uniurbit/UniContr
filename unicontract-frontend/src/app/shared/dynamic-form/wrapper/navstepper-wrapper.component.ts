import { Component, OnInit, Input, ViewChild, ElementRef, AfterContentInit } from '@angular/core';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { UntypedFormArray } from '@angular/forms';
import { NgbNavModule, NgbNav  } from '@ng-bootstrap/ng-bootstrap';

//ng g c shared/dynamic-form/navstepperWrapper -s true --spec false -t true


export interface StepType {
  label: string;
  fields: FormlyFieldConfig[];  
}

@Component({
    selector: 'app-navstepper-wrapper',
    templateUrl: './navstepper-wrapper.component.html',
    styleUrls: ['./navstepper-wrapper.component.css'],
    standalone: false
})


//<i class="glyphicon glyphicon-user"></i>
export class NavstepperWrapperComponent implements OnInit {
  
  @ViewChild('tabs', { static: true }) tabs:NgbNav;

  
  @Input()
  steps: StepType[];

  model={};
  form = new UntypedFormArray([]);  
  options: FormlyFormOptions[];
  fields: FormlyFieldConfig;

  activedStep = 0;  

  last = false;
  
  _selectedTab = 'tab-0';

  constructor() { 
  
  }

  ngOnInit() {            
    //this.form = new FormArray(this.steps.map(()=> new FormGroup({})));
    this.options = this.steps.map(() => <FormlyFormOptions> {});
    
  }

  prevStep(step) {
    if (step==0)
        return;
    this.activedStep = step - 1;
    this.selectActiveStep();
  }

  nextStep(step) {
    if (step == this.steps.length-1){
        return true;
    }        
    this.activedStep = step + 1;
    this.selectActiveStep();
  }  

  public get nextState(): boolean{
    if (this.form.at(this.activedStep)){
      return !this.form.at(this.activedStep).valid
    }
    return true;
  }

  selectActiveStep(){
    this.tabs.select('tab-'+ this.activedStep);
  }

  
  public get lastIndex() : string {
    return 'tab-'+ (this.steps.length-1);
  }

  public get selectedTab() : string {
    return this._selectedTab;
  }

  
  public set selectedTab(value : string) {
      this._selectedTab = value;
      this.activedStep = +value.replace('tab-','');
  }
  

  getStepTitle(index){
      let step = this.steps[index];
      if (step && step.label){
          return step.label
      }
      return "Passo "+index;
  }

  onTabChange($event){
    this.selectedTab = $event.nextId        
    if (this.lastIndex == $event.nextId as string){
        this.last=true;
    }else{
        this.last=false;
    }
 }

}
