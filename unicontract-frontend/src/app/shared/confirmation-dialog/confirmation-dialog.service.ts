import { Injectable } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { InputConfirmationDialogComponent, IResultDialog } from '../input-confirmation-dialog/input-confirmation-dialog.component';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable()
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal, private sanitizer: DomSanitizer ) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Sì',
    btnCancelText: string = 'No',
    dialogSize: 'sm'|'lg' = 'sm',
    messageHtml: string = null,
    pdfFilevalue: Observable<ArrayBuffer> = null): Promise<boolean> {      
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize, backdrop : 'static',
    keyboard : false });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.messageHtml = messageHtml ? this.sanitizer.bypassSecurityTrustHtml( messageHtml) : messageHtml;
    modalRef.componentInstance.pdfFilevalue = pdfFilevalue;

    return modalRef.result;
  }


  public inputConfirm(
    title: string,
    message: string,
    btnOkText: string = 'Si',
    btnCancelText: string = 'No',
    dialogSize: 'sm'|'lg' = 'lg',
    messageHtml: string = null,
    fields: FormlyFieldConfig[] = null,
    pdfFilevalue: Observable<ArrayBuffer> = null,
    extraData: any = null): Promise<IResultDialog<any>> {
    const modalRef = this.modalService.open(InputConfirmationDialogComponent, { size: dialogSize, backdrop : 'static',
      keyboard : false });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.messageHtml = messageHtml;
    if (fields){
      modalRef.componentInstance.fields = fields;
    }
    //modalRef.componentInstance.pdfFilevalue = pdfFilevalue;
    if (extraData){
      modalRef.componentInstance.extraData = extraData;
    }
    if (pdfFilevalue){
      modalRef.componentInstance.options.formState.pdfSrc = pdfFilevalue;
    }
    return modalRef.result;
  }

}
