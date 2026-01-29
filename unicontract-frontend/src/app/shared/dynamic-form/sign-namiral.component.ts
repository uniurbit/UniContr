import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from '@ngx-formly/core';
import { of } from 'rxjs';
import { encode, decode } from 'base64-arraybuffer'
import { ISignResponse } from '../sign-namirial-smart-card.service';
import { SignNamiralService } from '../sign-namirial.service';
import { StoryProcess } from 'src/app/classes/storyProcess';
import { StoryHelperProcessService } from '../storyHelperProcess.service';





@Component({
    selector: 'formly-field-sign',
    template: `
    
    <div class="form-group">                 
        <div class="d-flex">        
            <button type="button" class="btn btn-sm btn-success rounded-lg me-2" (click)="capturesig()">{{ to.label }}</button>
        </div>
        
    </div>
    `,
    standalone: false
})

// <label [attr.for]="id" class="form-control-label control-label" *ngIf="to.label">
//       {{ to.label }}
//       <ng-container *ngIf="to.required && to.hideRequiredMarker !== true">*</ng-container>
//     </label>    
//<div class="d-inline-flex justify-content-start border bg-light">
//  <div id="imageBox" class="boxed" style="height:35mm;width:60mm; border:1px solid #d3d3d3;">

export class FormlyFieldSignNamiral extends FieldType implements OnInit, OnDestroy {

    @ViewChild('imageBox', { static: true }) imageBox: ElementRef<HTMLElement>;

    private toBeCancelled: boolean = false;
    //identifica lo stato del pulsante conferma
    public premutoConferma: boolean = false;

    public signedDocument: string;
    private pdfResult: Blob = null;
    private step: string = null;

    static currentFormControl: FormlyFieldSignNamiral;

    //per la firma grafometrica
    constructor(private sanitizer: DomSanitizer, public signService: SignNamiralService, public storyService: StoryHelperProcessService, private cdr: ChangeDetectorRef) {
        super()
    }

    ngOnDestroy(): void {
        console.log('clearmemory');
        this.signService.clearMemory();
    }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
    }

    @HostListener('document:responseerror', ['$event'])
    onResponseError(ev: any) {

        console.log(ev.detail);
        console.log(this);

        if (this === undefined) { return }
        // if (this.key === undefined) { return }

        //ev.detail == this.key ||
        if ( ev.detail == 'offline_callback') {
            this.formState.isLoading = false;
            this.cdr.detectChanges();
        }
    }

    @HostListener('document:signaturetext', ['$event'])
    onSignatureText(ev) {
        //console.log(ev); // element that triggered event, in this case HTMLUnknownElement
        //console.log(this);
        if (this.key === undefined) { return }

        if (ev.detail == this.key) {
            console.log('on signature text');
            this.setControlValue();
        }
    }

    storyProcess(description: string) {
        const story = new StoryProcess();
        story.insegn_id = this.formState.extraData.ctr.insegn_id;
        story.descrizione = description;
        this.storyService.newStory(story).subscribe();
    }

    setControlValue() {

        this.cdr.detectChanges();

        this.pdfResult['arrayBuffer']().then(value => {
            const data = {
                filevalue: encode(value)
            }
            this.formControl.setValue(data);
        });

    }

    //procedura di firma che coinvolge due stati successivi che sono: dichiarazione_firma_grafometrica e contratto.
    //- la dichiarazione_firma_grafometrica prevede l'accettazione delle condizioni di firma premento ok sulla tavoletta grafica, 
    //- il contratto prevede l'apposzione della firma.
    capturesig() {
        //funzione di risposta al click sul bottone di firma. .step = 'contratto';

        this.step = 'dichiarazione_firma_grafometrica';

        //il componente può essere associato a un controllo di firma singola o multipla
        //ad esempio nel caso del contratto ho una firma multipla

        FormlyFieldSignNamiral.currentFormControl = this;
        //inizio processo di firma: caricamento file e firma
        FormlyFieldSignNamiral.currentFormControl.formState.isLoading = true;
        if (this.to.ordinefirma != null && this.to.ordinefirma > 0) {
            //significa che una firma è già stata fatta
            this.signService.loadSignedDocumentFromMemory('https://localhost:7777/files/memory/signeddocument.pdf', this.loadDocumentEnd);
        } else {
            this.signService.loadDocument(this.formState.extraData.ctr.id, this.step == 'dichiarazione_firma_grafometrica' ? 'dichiarazione_firma_grafometrica' : this.to.tipo_modello, this.loadDocumentEnd);
            //this.signService.loadDocument(this.formState.extraData.ctr.id, this.to.tipo_modello == 'modulo' ? this.model.tipo_modello : this.to.tipo_modello, this.loadDocumentEnd);
        }

    }


    signEnd(response: ISignResponse) {
        //console.log('--fine firma--');
        //console.log(response);
        if (!response.success) {
            //caso di errore
            console.log(response);
            FormlyFieldSignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stato prodotto nessun file");
            FormlyFieldSignNamiral.currentFormControl.signedDocument = null;
            document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: FormlyFieldSignNamiral.currentFormControl.key }));
        }
        else {
            if (response.signedDocument) {
                FormlyFieldSignNamiral.currentFormControl.signedDocument = response.signedDocument;
                //ricaricare documento nella preview
                //memorizzare il file in filevalue ...   
                //leggi il documento dopo la firma
                FormlyFieldSignNamiral.currentFormControl.signService.readSignedDocumentArray((response) => {
                    //lettura
                    FormlyFieldSignNamiral.currentFormControl.formState.isLoading = false;
                    if (!response.success) {
                        //caso di errore
                        // console.log(response);
                        FormlyFieldSignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stato caricato nessun file");
                        document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: FormlyFieldSignNamiral.currentFormControl.key }));
                    } else {
                        const bytearray = new Uint8Array(response.content)
                        FormlyFieldSignNamiral.currentFormControl.pdfResult = new Blob([bytearray], { type: "application/pdf" });

                        FormlyFieldSignNamiral.currentFormControl.pdfResult['arrayBuffer']().then(value => {
                            FormlyFieldSignNamiral.currentFormControl.options.formState.pdfSrc = of(value)
                            FormlyFieldSignNamiral.currentFormControl.formControl.markAsDirty();
                        });
                        //fire event di fine firma                
                        //console.log('Fire event signaturetext');
                        const domEvent = new CustomEvent('signaturetext', { bubbles: true, detail: FormlyFieldSignNamiral.currentFormControl.key });
                        document.dispatchEvent(domEvent);

                    }
                    //console.log('--fine readSignedDocumentArray--');
                });

            }
        }
    }


    //callback
    loadDocumentEnd(response: ISignResponse) {
        //console.log('---fine loadDocument---');
        //console.log(response);
        if (!response.success || response.errorMessage) {
            FormlyFieldSignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stato caricato nessun file");
            FormlyFieldSignNamiral.currentFormControl.signedDocument = null;
            document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: FormlyFieldSignNamiral.currentFormControl.key }));
        }
        else {
            FormlyFieldSignNamiral.currentFormControl.signStart();
        }
    }

    accettazioneFirmaGrafometrica(response: ISignResponse) {
        console.log('--accettazione firma grafometrica--');
        if (!response.success || response.errorMessage) {
            if (FormlyFieldSignNamiral.currentFormControl.step == 'dichiarazione_firma_grafometrica' && (response.errorCode == '17' || response.errorCode == '1000')){
                //registrata la 'dichiarazione_firma_grafometrica'
                FormlyFieldSignNamiral.currentFormControl.storyProcess("Accettata informativa firma grafometrica da parte del docente");
                //L'utente per arrivare qui può aver premuto solo il tasto OK
                FormlyFieldSignNamiral.currentFormControl.step = 'contratto';
                FormlyFieldSignNamiral.currentFormControl.signService.loadDocument(FormlyFieldSignNamiral.currentFormControl.formState.extraData.ctr.id,
                    'contratto', FormlyFieldSignNamiral.currentFormControl.loadDocumentEnd);
            } else {
                FormlyFieldSignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stata accettata l'informativa sulla firma grafometrica");
                FormlyFieldSignNamiral.currentFormControl.signedDocument = null;
                document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: FormlyFieldSignNamiral.currentFormControl.key }));
            }
        } else {
            //errorCode: 17 errorMessage: "Nessuna firma è stata effettuata."
            //occorre registrare accettazione
            //iniziare il processo di firma
            FormlyFieldSignNamiral.currentFormControl.step = 'contratto';
            FormlyFieldSignNamiral.currentFormControl.signService.loadDocument(FormlyFieldSignNamiral.currentFormControl.formState.extraData.ctr.id,
                'contratto', FormlyFieldSignNamiral.currentFormControl.loadDocumentEnd);
        }
    }


    signStart() {
        //se lo stato è dichiarazione_firma_grafometrica la posizione è : page|x|y|width|height|ppi 
        // '1|85|580|600|96';
        if (FormlyFieldSignNamiral.currentFormControl.step == 'dichiarazione_firma_grafometrica') {
            //firma 
            //posizione test 1 = '1|90|560|800|130|96'
            FormlyFieldSignNamiral.currentFormControl.signService.signStart('1|110|87|600|400|96', FormlyFieldSignNamiral.currentFormControl.accettazioneFirmaGrafometrica);
        } else {
            //calcola la posizione della firma
            let position = FormlyFieldSignNamiral.currentFormControl.options.formState.widgetPDFSignaturePosition;
            //se position è un array prendi il numero indicato dal bottone di firma 
            if (Array.isArray(position)) {
                position = FormlyFieldSignNamiral.currentFormControl.options.formState.widgetPDFSignaturePosition[FormlyFieldSignNamiral.currentFormControl.field.props.ordinefirma];
            }

            //firma 
            FormlyFieldSignNamiral.currentFormControl.signService.signStart(position, FormlyFieldSignNamiral.currentFormControl.signEnd);

        }

    }



}