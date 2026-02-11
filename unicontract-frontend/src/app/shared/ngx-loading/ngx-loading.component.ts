import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'ngx-loading',
    templateUrl: './ngx-loading.component.html',
    styleUrls: ['./ngx-loading.component.css'],
    standalone: false
})
export class NgxLoadingComponent implements OnChanges {
  @Input() show = false;
  @Input() config: any;

  public spinnerName: string;

  constructor(private spinner: NgxSpinnerService) {
    this.spinnerName = `ngx-loading-${crypto.randomUUID()}`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show']) {
      if (this.show) {
        this.spinner.show(this.spinnerName);
      } else {
        this.spinner.hide(this.spinnerName);
      }
    }
  }
}
