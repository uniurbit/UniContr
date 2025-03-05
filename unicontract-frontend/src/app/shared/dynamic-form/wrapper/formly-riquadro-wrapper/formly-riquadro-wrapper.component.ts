  import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
  import { FieldWrapper } from '@ngx-formly/core';

  @Component({
    selector: 'formly-riquadro-wrapper',
    template: `  
    <div class="card border border-primary pt-2 pe-2 ps-2 mb-2" style="border-radius: 3px !important;" >
      <h5 *ngIf="to?.title">{{ to.title }}</h5>
      <ng-container #fieldComponent></ng-container>
    </div>
    `,
    styles: []
  })
  export class FormlyRiquadroWrapperComponent extends FieldWrapper {
  }
