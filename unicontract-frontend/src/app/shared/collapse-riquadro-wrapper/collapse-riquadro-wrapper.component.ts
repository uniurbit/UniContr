import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-collapse-riquadro-wrapper',
    template: `
  <div class="card border border-primary p-2 mb-2" style="border-radius: 3px !important;">
  <div class="card-title mb-0" [ngClass]="{
    'bg-light-danger': options.type == 'danger',
    'bg-light-warning': options.type == 'warning',
    'bg-light-info': options.type == 'info'
  }">         
      <button class="btn btn-sm btn-link float-end" type="button" (click)="isCollapsed = !isCollapsed" [attr.aria-expanded]="!isCollapsed" aria-controls="collapseComp">         
        <span *ngIf="isCollapsed" class="oi oi-chevron-top"></span>
        <span *ngIf="!isCollapsed" class="oi oi-chevron-bottom"></span>

      </button>          
      <div *ngIf="options && options.title" class="align-items-center">                  
          <h5>{{options.title}}</h5>
          <h6 *ngIf="options && options.subtitle" class="card-subtitle">{{options.subtitle}}</h6>            
      </div>   
  </div>
  <div id="collapseComp" [ngbCollapse]="isCollapsed">
    <ng-content></ng-content>
  </div>  
</div>     
  `,
    styles: [],
    standalone: false
})
export class CollapseRiquadroWrapperComponent implements OnInit {

  @Input() options: {
    title?: string,
    subtitle?: string,
    type: string,
  }
  
  public isCollapsed = false;

  constructor() { }

  ngOnInit() {
  }

}
