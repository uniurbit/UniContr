import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { FieldType } from '@ngx-formly/core';
import { of } from 'rxjs';
import { ISignResponse, SignNamiralService } from '../sign-namirial.service';
import { encode, decode } from 'base64-arraybuffer'


@Component({
    selector: 'formly-field-sign',
    template: `
    
    <div class="form-group">                 
        <div class="d-flex">        
            <button type="button" class="btn btn-sm btn-success rounded-lg mr-2" (click)="capturesig()">{{ to.label }}</button>
        </div>
        
    </div>
    `,
})


export class SignNamiral extends FieldType implements OnInit, OnDestroy {
    
    //identifica lo stato del pulsante conferma
    public premutoConferma: boolean = false;

    public signedDocument: string;
    private pdfResult: Blob = null;

    static currentFormControl: SignNamiral;

    constructor(private sanitizer: DomSanitizer, public signService: SignNamiralService, private cdr: ChangeDetectorRef) {
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
    onResponseError(ev)
    {        
        console.log(ev)
        if (ev.detail == SignNamiral.currentFormControl.key || ev.detail == 'offline_callback') {
            SignNamiral.currentFormControl.formState.isLoading = false;
            SignNamiral.currentFormControl.cdr.detectChanges();
        }
    }

    @HostListener('document:signaturetext', ['$event'])
    onSignatureText(ev) {
        //console.log(ev); // element that triggered event, in this case HTMLUnknownElement
        if (ev.detail == this.key) {
            //console.log('on signature text');
            this.setControlValue();
        }            
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

    capturesig() {
        //il componente può essere associato a un controllo di firma singola o multipla
        //ad esempio nel caso del contratto ho una firma multipla

        SignNamiral.currentFormControl = this;
        //inizio processo di firma: caricamento file e firma
        SignNamiral.currentFormControl.formState.isLoading = true;
        if (this.to.ordinefirma != null && this.to.ordinefirma > 0){
            //significa che una firma è già stata fatta
            this.signService.loadSignedDocumentFromMemory('https://localhost:7777/files/memory/signeddocument.pdf',this.loadDocumentEnd);            
        }else{
            this.signService.loadDocument(this.formState.extraData.ctr.id, 'contratto', this.loadDocumentEnd);
        }
        
    }


    signEnd(response: ISignResponse) {
        //console.log('--fine firma--');
        //console.log(response);
        if (!response.success) {
            //caso di errore
            console.log(response);
            SignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stato prodotto nessun file");
            SignNamiral.currentFormControl.signedDocument = null;
            document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: SignNamiral.currentFormControl.key }));     
        }
        else {
            if (response.signedDocument) {
                SignNamiral.currentFormControl.signedDocument = response.signedDocument;
                //ricaricare documento nella preview
                //memorizzare il file in filevalue ...   
                //leggi il documento dopo la firma
                SignNamiral.currentFormControl.signService.readSignedDocumentArray((response) => {                    
                    //lettura
                    SignNamiral.currentFormControl.formState.isLoading = false;
                    if (!response.success) {                            
                        //caso di errore
                        // console.log(response);
                        SignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stato caricato nessun file");                        
                        document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: SignNamiral.currentFormControl.key }));                
                    } else {
                        const bytearray = new Uint8Array(response.content)
                        SignNamiral.currentFormControl.pdfResult = new Blob([bytearray], { type: "application/pdf" });

                        SignNamiral.currentFormControl.pdfResult['arrayBuffer']().then(value => {
                            SignNamiral.currentFormControl.options.formState.pdfSrc = of(value)
                        });
                        //fire event di fine firma                
                        //console.log('Fire event signaturetext');
                        const domEvent = new CustomEvent('signaturetext', { bubbles: true, detail: SignNamiral.currentFormControl.key });
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
            SignNamiral.currentFormControl.signService.messageService.error(response.errorMessage || "Non è stato caricato nessun file");
            SignNamiral.currentFormControl.signedDocument = null;
            document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: SignNamiral.currentFormControl.key }));     
        }
        else {            
            SignNamiral.currentFormControl.signStart();
        }
    }


    signStart(){
        //calcola la posizione della firma
        let position = SignNamiral.currentFormControl.options.formState.widgetPDFSignaturePosition;
        //se position è un array prendi il numero indicato dal bottone di firma 
        if (Array.isArray(position)){
            position = SignNamiral.currentFormControl.options.formState.widgetPDFSignaturePosition[SignNamiral.currentFormControl.field.templateOptions.ordinefirma];
        }

        //firma 
        SignNamiral.currentFormControl.signService.signStart(position, SignNamiral.currentFormControl.signEnd);

    }



}