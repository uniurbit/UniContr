import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';



export interface IResultDialog<T> {    
  result: boolean;
  entity: T;
}



@Component({
    selector: 'app-input-confirmation-dialog',
    templateUrl: './input-confirmation-dialog.component.html',
    styles: [],
    standalone: false
})
// ng g c shared/inputConfirmationDialog -s true --spec false
export class InputConfirmationDialogComponent implements OnInit {
  
  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  @Input() messageHtml: string;
  private _extraData: any = null
  @Input() public set extraData(value: any) {   
    this._extraData = value;
    this.options.formState.extraData = this.extraData
  }
  public get extraData(): any {
    return this._extraData;
  }


  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,     
      container: this,
      extraData: this.extraData
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
          props: {
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

  constructor(private activeModal: NgbActiveModal, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.cdr.detectChanges();
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
