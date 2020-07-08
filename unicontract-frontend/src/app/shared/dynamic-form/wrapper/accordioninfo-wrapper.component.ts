import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-accordioninfo',
  template: `  
    <div class="card">
      <div class="card-header bg-info">
        <h4 class="m-b-0 text-white">{{ to.label }}</h4>        
      </div>
      <div>
        <div class="card-body">
          <ng-container #fieldComponent></ng-container>
        </div>
      </div>
    </div>  
  `,
})
export class AccordionInfoWrapperComponent extends FieldWrapper {  
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}