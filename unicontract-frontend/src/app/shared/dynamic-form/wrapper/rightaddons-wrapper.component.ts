import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';

@Component({
  selector: 'formly-wrapper-rightaddons',
  template: `  
  <div class="input-group">
    <div class="input-addons">
      <ng-container #fieldComponent></ng-container>
    </div>
    <ng-container #fieldComponent></ng-container>
    <div class="input-group-append" *ngIf="to.addonRights" > 
      <ng-container *ngFor="let item of to.addonRights; index as i;">    
        <button type="button" class="input-group-text" [disabled]="to.disabled && !item.alwaysenabled" 
            title="{{item.text}}" [ngClass]="item.class" *ngIf="item.class"  (click)="addonRightClick($event,i)"></button>               
      </ng-container>
    </div>
  </div>
  `,
  styleUrls: ['./rightaddons-wrapper.component.scss'],
})
//[ngStyle]="{cursor: to.addonRights.onClick ? 'pointer' : 'inherit'}"
//<span *ngIf="to.addonRight1.text" class="input-group-text">{{ to.addonRight1.text }}</span>
export class RightaddonsWrapperComponent extends FieldWrapper {
  public isCollapsed = false;
  @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

  addonRightClick($event: any,i) {
    if (this.to.addonRights[i].onClick) {
      this.to.addonRights[i].onClick(this.to, this, $event);
    }
  }

}