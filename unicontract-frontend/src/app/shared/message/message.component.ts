import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';
import { InfraMessageType, InfraMessage } from './message';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styles: [
        `
      .dark-modal .modal-content {
        background-color: #009efb;
        color: white;
      }
      .dark-modal .close {
        color: white;
      }
    `
    ],
    standalone: false
})
export class MessageComponent implements OnInit {
    isCollapsed = false;

    form = new UntypedFormGroup({});

    protected model = {};

    protected fields: FormlyFieldConfig[] = [
        {
            type: 'input',
            key: 'name',
            props: {
                label: 'Tipo',
                disabled: true,
            },
        },
        {
            type: 'input',
            key: 'message',
            props: {
                label: 'Messaggio',
                disabled: true,
            },
        },

        {
            type: 'input',
            key: 'error.message',
            props: {
                label: 'Descrizione',
                disabled: true,
            },
        },
        {
            type: 'textarea',
            key: 'errors',
            props: {
                disabled: true,
                label: 'Contenuto',
                rows: 5,
            },
        },

    ];

    constructor(private cdRef: ChangeDetectorRef, public messageService: MessageService, private modalService: NgbModal, public activeModal: NgbActiveModal) { }

    messages: Observable<InfraMessage[]>;
    length: number;

    ngOnInit() {
        this.messages = this.messageService.messages;
        this.messages.subscribe(x => {
            this.length = x.length;
            this.cdRef.detectChanges();
        });
    }

    cssClass(msg: InfraMessage) {
        if (!msg) {
            return;
        }

        // return css class based on alert type
        switch (msg.type) {
            case InfraMessageType.Success:
                return '';
            case InfraMessageType.Error:
                return 'bg-danger text-white';
            case InfraMessageType.Info:
                return 'bg-light text-dark';
            case InfraMessageType.Warning:
                return 'bg-warning text-dark';
        }

    }

    onSelect(msg: InfraMessage, content) {
        if (msg.error) {
            this.model = msg.error;

            if (msg.error.error) {

                let msgErrors: string ='';
                if (msg.error.error.message)
                    msgErrors = msg.error.error.message;
                else if(typeof(msg.error.error)=='string'){
                    msgErrors = msg.error.error;
                }    
                if (msg.error.error.errors) {
                    let errors = msg.error.error.errors;
                    Object.keys(errors).forEach(key => msgErrors += errors[key].toString());
                }
               
                this.model['errors'] = msgErrors;
            }
            const modalRef = this.modalService.open(content, {
                size: 'lg'
            }).result.then(() => this.model = {});
        }
    }

}
