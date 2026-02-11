import { Component, OnInit, Input, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'app-collapse-wrapper',
    template: `  
  <div class="card">
    <div class="card-body" [ngClass]="{
      'bg-light-danger': options.type == 'danger',
      'bg-light-warning': options.type == 'warning',
      'bg-light-info': options.type == 'info'
    }">         
        <button class="btn btn-sm btn-link float-end" type="button" (click)="isCollapsed = !isCollapsed" [attr.aria-expanded]="!isCollapsed" aria-controls="collapseComp">         
          <span *ngIf="isCollapsed" class="oi oi-chevron-top"></span>
          <span *ngIf="!isCollapsed" class="oi oi-chevron-bottom"></span>

        </button>          
        <div class="align-items-center">                  
            <h4 class="card-title me-4">{{options.title}}</h4>
            <h5 *ngIf="options && options.subtitle" class="card-subtitle">{{options.subtitle}}</h5>            
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
//ng g c collapseWrapper -s true --spec false -t true
export class CollapseWrapperComponent implements OnInit {  
  
  public isCollapsed = false;

  @Input() options: {
    title?: string,
    subtitle?: string,
    type: string,
  }
  

  constructor() {
    this.options = {
      type: 'info'
    }
  }

  ngOnInit() {
  }

}
