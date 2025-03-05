import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AppConstants } from "../app-constants";
import { AuthService } from "../core/auth.service";
import { MessageService } from "./message.service";
import { BaseService } from "./base-service/base.service";
import * as saveAs from "file-saver";



export const ReaderName: string = 'Hamlet HUSCR-NFC 0';
export const TabletName: string = 'tdWacomSTU430';


export interface ISignResponse {
    document?: string;
    signedDocument?: string;
    errorCode: string;
    errorMessage: string;
    success: string;
    successMessage: string;
}

declare var fcHttpServerOfflineCallback: any; 
declare var fcsign: any;

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/pdf',         
      'Referrer-Policy': 'no-referrer'
    })
  };


@Injectable()
export class SignNamiralSmartCardService extends BaseService {
    _baseURL: string;
      
    public signedDocument: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(protected http: HttpClient, public messageService: MessageService) {
        super(http,messageService, null);
        this._baseURL = 'https://localhost:7777/';        
    }

    offLineCallback() {
        document.dispatchEvent(new CustomEvent('responseerror', { bubbles: true, detail: 'offline_callback' }));     
        alert('Servizio di firma grafometrica non disponibile');  
        this.messageService.error('Servizio di firma grafometrica non disponibile');
    }

    getSignedDocument(url): Observable<any> {       
        return this.http.get<any>(url, httpOptions).pipe(catchError(this.handleError('getSignedDocument')));          
    }

    signStart(widgetPDFSignaturePosition: string, callback: (response: ISignResponse) => void = null) {
        //precondizione il file deve essere caricato in memoria
        //console.log('--inizio firma--')
        let uploadUrl = '';
        let fileUrl = 'MEMORY';
        if (callback == null) {
            fcsign.callback = (response: ISignResponse) => {
                if (!response.success) {
                    this.messageService.error(response.errorMessage || "Non è stato prodotto nessun file");
                    this.signedDocument = null;
                }
                else {
                    if (response.signedDocument) {
                        this.signedDocument.next(response.signedDocument);
                    }
                }
            };
        } else {
            fcsign.callback = callback;
        }


        fcsign.extraParams = '';   
        fcsign.extraParams += "BiometricData=0;"; // Instruct the process to capture biometrica data (pressure, speed, acceleration, graphic stroke)

        if (widgetPDFSignaturePosition){
            fcsign.extraParams += 'WidgetPDFSignaturePosition='+widgetPDFSignaturePosition;
        }            
        // sSignatureParameters += "ReaderName=FirmaGrafoCertaTest;";   // Specify the certificate to use
        // sSignatureParameters += "BiometricData=1;";                // Instruct the process to capture biometrica data (pressure, speed, acceleration, graphic stroke)
        // sSignatureParameters += "AdvancedSignature.TabletModel=tdWacomSTU530;";  // Specify with device use to capture the signature
        // sSignatureParameters += "Signature.NoPdfSignInfo=1;"; // Force the process to not require additional signature info after signature process
        fcsign.extraParams += "Signature.MakePdfOriginal=1;"; // Specify the Pades signature
        fcsign.extraParams += "Pdf.LogoAutoPosition=1;"; // Specify the Pades signature
        // sSignatureParameters += "SignedFile.SaveInSameFolder=1;"; // Specify to save the signed file in same folder of the original file
        // sSignatureParameters += "SignedFile.ForceOverwrite=1;"; // use this option if you want to overwrite the original file with signed file          
                            
        fcsign.extraParams = fcsign.extraParams + ';ReaderName=' + ReaderName;
        fcsign.sign(fileUrl, 'document.pdf', uploadUrl, '7302_Signed.pdf', 0);
      
    }

    loadSignedDocumentFromMemory(fileURL: string, callback=null){
        if (callback == null) {                  
            fcsign.callback = function (response) {                
                //console.log(response);
                if (!response.success) {
                    this.messageService.error(response.errorMessage || "Non è stato caricato nessun file");
                }                
            };
        } else {
            fcsign.callback = callback;
        }
        //console.log('---inizio loadDocument---');
        fcsign.loadDocumentInMemory(fileURL);

    }

    loadDocument(contratto_id: string, tipo_modello: string, callback = null) {
        fcHttpServerOfflineCallback = this.offLineCallback;
        if (callback == null) {                  
            fcsign.callback = function (response) {                
                //console.log(response);
                if (!response.success) {
                    this.messageService.error(response.errorMessage || "Non è stato caricato nessun file");
                }                
            };
        } else {
            fcsign.callback = callback;
        }

        //carica il documento
        //console.log('---inizio loadDocument---');     
        let fileURL = AppConstants.baseApiURL+'/attachments/downloadpdf/' + contratto_id +'?tipo_modello='+tipo_modello+'&token='+ localStorage.getItem(AuthService.TOKEN);                       
        fcsign.loadDocumentInMemory(fileURL);
    }

    addSignedDocument(url){
        this.signedDocument.next(url);
    }

    readSignedDocumentArray(callback = null){
        //console.log('--inizio readSignedDocumentArray--')
        if (callback == null) {                  
            fcsign.callback = function (response) {                
                //console.log(response);                
                if (!response.success) {
                    this.messageService.error(response.errorMessage || "Non è stato caricato nessun file");
                } else {
                    const bytearray = new Uint8Array(response.content)
                    const pdfResult = new Blob([bytearray],{type:"application/pdf"});
                    let file=new File([pdfResult],"signedDocument.pdf");
                    saveAs(pdfResult,"signedDocument.pdf");
                }                  
                //console.log('--fine readSignedDocumentArray--')
            };
        } else {
            fcsign.callback = callback;
        }

        fcsign.readSignedDocumentArray()
    }

    clearMemory()
    {
        fcHttpServerOfflineCallback = null;
        fcsign.callback = (response) => {}
        fcsign.clearMemory();
    }


}