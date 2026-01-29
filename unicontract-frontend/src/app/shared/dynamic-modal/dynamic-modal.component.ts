import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  AfterViewInit,
  Type,
  Injector
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styles: [],
  standalone: false
})
export class DynamicModalComponent implements AfterViewInit {
  @Input() title = 'Modal';
  @Input() component!: Type<any>;
  @Input() inputs: Record<string, any> = {};

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor(public modal: NgbActiveModal, private injector: Injector) {}

  ngAfterViewInit(): void {
    this.container.clear();
    const componentRef: ComponentRef<any> = this.container.createComponent(this.component, {
      injector: this.injector,
    });

    if (this.inputs && componentRef.instance) {
      Object.entries(this.inputs).forEach(([key, value]) => {
        componentRef.instance[key] = value;
      });
    }

    setTimeout(() => componentRef.instance.form.disable());
  }
}
