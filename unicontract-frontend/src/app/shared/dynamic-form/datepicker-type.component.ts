import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { DatePipe } from '@angular/common';
// placeholder="dd-mm-yyyy"      
@Component({
  selector: 'app-datapicker-type',
  providers: [DatePipe],
  template: `
  <!--Datapicker container='body'-->
  <div class="input-group">    
    <input class="form-control" 
        
          
        [formControl]="formControl"                
        [displayMonths]="displayMonths" 
        [navigation]="navigation"
        [outsideDays]="outsideDays" 
        [showWeekNumbers]="showWeekNumbers"     
        [startDate]="to.datepickerOptions?.startDate"
        [minDate]="to.datepickerOptions?.minDate"
        [maxDate]="to.datepickerOptions?.maxDate"
        [formlyAttributes]="field"
        name="d"    
        ngbDatepicker #d="ngbDatepicker"   
        [class.is-invalid]="showError"    
       >
      <div class="input-group-append">
        <button class="btn btn-outline-secondary input-group-text oi oi-calendar" (click)="d.toggle()" type="button">
         
        </button>
    </div>
  </div>
  `,
  styles: []
})
// [ngClass]="{'is-invalid': showError )}"
//formControl.invalid && (formControl.dirty || formControl.touched || field?.validation?.show
//<img src="assets/img/calendar-icon.svg" style="width: 1.2rem; height: 1rem; cursor: pointer;" />
export class DatepickerTypeComponent extends FieldType {

  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  

  constructor(private datePipe: DatePipe) {
    super();
  }

  ngOnInit() {        
    if (!isNaN(Date.parse(this.formControl.value))) {
      //this.formControl.setValue(this.datePipe.transform(this.formControl.value, 'dd-MM-yyyy'));       
    }
  }

  onPopulate(field: FormlyFieldConfig) {
    if (!field.templateOptions) {
      return;
    }
    field.templateOptions.pattern = /^(0[1-9]|1[0-9]|2[0-9]|3[01])-(0[1-9]|1[012])-[0-9]{4}$/;
  }

}
