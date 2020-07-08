import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-list',
  template: `
    <div class="row">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class ViewListComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
