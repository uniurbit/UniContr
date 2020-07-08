import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-list-item',
  template: `
  <div class="row">
    <div class="col-md-2 text-truncate" title="{{ label }}">{{ label }}:</div>
    <div class="col-md-10">{{ value }}
    <ng-content></ng-content>
    </div>  
  </div>
  `,
  styles: []
})
//style="font-weight: bold;"
export class ListItemComponent implements OnInit {

  @Input() label;
  @Input() value;

  constructor() { }

  ngOnInit() {
  }

}
