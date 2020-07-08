// tooltip-wrapper.component.ts
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
selector: 'formly-wrapper-tooltip',
template: `    
    <div placement="top" ngbTooltip="to.tooltip.content">
    <ng-container #fieldComponent ></ng-container>    
    </div>    
`,
})
export class TooltipWrapperComponent extends FieldWrapper {
    @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
}