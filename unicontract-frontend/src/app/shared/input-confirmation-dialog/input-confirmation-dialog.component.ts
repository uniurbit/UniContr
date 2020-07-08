import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';



export interface IResultDialog<T> {    
  result: boolean;
  entity: T;
}



@Component({
  selector: 'app-input-confirmation-dialog',
  templateUrl: './input-confirmation-dialog.component.html',
  styles: []
})
// ng g c shared/inputConfirmationDialog -s true --spec false
export class InputConfirmationDialogComponent implements OnInit {
  
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() messageHtml: string;

  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,      
    },
  };
  @Input() fields: FormlyFieldConfig[] = [
    // motivazione
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'motivazione',
          type: 'textarea',
          className: 'col-md-12',
          templateOptions: {
            required: true,
            label: 'Motivazione',
            rows: 2,
            maxLength: 150,
            description: 'Lunghezza massima 150 caratteri',
          },
        },
      ],
    }
  ]; 

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    let obj : IResultDialog<any> = {
      result: false,
      entity: null
    }
    this.activeModal.close(obj);
  }

  public accept() {
    let obj: IResultDialog<any> = {
      result: true,
      entity: this.model
    }
    this.activeModal.close(obj);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }


}
