import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-riquadro-wrapper',
  template: `
    <div class="border border-primary p-2 mb-2" style="border-radius: 3px !important;" >
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class RiquadroWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
