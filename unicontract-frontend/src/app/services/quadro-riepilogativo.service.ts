import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PrecontrattualeInterface, InfraResponse } from '../interface/precontrattuale';
import { Cacheable } from 'ts-cacheable';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };


@Injectable()
export class SummaryService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/summary';
        }

    getSummary(id: number) {
        return this.http.get(this._baseURL + '/' + id);
    }

    download(id): Observable<any>{
        if (id) {
            return this.http.get( AppConstants.baseApiURL + '/attachments/download/' + id.toString()).pipe(catchError(this.handleError('download', null, false)));
        }
        return of([]);
    }

    @Cacheable()
    getTitulusDocumentURL(id): Observable<any> {
      return this.http.get(AppConstants.baseApiURL + '/precontrattuale/gettitulusdocumenturl/' + id.toString(), httpOptions).pipe(
        catchError(this.handleError('getTitulusDocumentURL', null, true))
      );
    }

    previewContratto(insegn_id): Observable<any>{
        if (insegn_id) {
            return this.http.get( AppConstants.baseApiURL + '/precontrattuale/previewcontratto/' + insegn_id.toString()).pipe(catchError(this.handleError('previewcontratto', null, false)));
        }
        return of([]);
    }

    modulisticaPrecontr(insegn_id): Observable<any>{
        if (insegn_id) {
            return this.http.get( AppConstants.baseApiURL + '/precontrattuale/modulisticaprecontr/' + insegn_id.toString()).pipe(catchError(this.handleError('modulisticaprecontr', null, false)));
        }
        return of([]);
    }

    validazioneAmm(data) {
        return this.http.post( AppConstants.baseApiURL + '/precontrattuale/validazioneamm', data)
            .pipe(catchError(this.handleError('validazioneamm', null, false)));
    }

    validazioneEconomica(data) {
        return this.http.post( AppConstants.baseApiURL + '/precontrattuale/validazioneeconomica', data)
            .pipe(catchError(this.handleError('validazioneeconomica', null, false)));
    }

    annullaAmm(data) {
        return this.http.post( AppConstants.baseApiURL + '/precontrattuale/annullaamm', data)
            .pipe(catchError(this.handleError('annullaamm', null, false)));
    }

    annullaEconomica(data) {
        return this.http.post( AppConstants.baseApiURL + '/precontrattuale/annullaeconomica', data)
            .pipe(catchError(this.handleError('annullaEconomica', null, false)));
    }

    presaVisioneAccettazione(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/presavisioneaccettazione', data, httpOptions)
            .pipe(catchError(this.handleError('presaVisione', null, false)));
    }

    firmaGrafometrica(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/firmagrafometrica', data, httpOptions)
            .pipe(catchError(this.handleError('presaVisione', null, false)));
    }


    richiestafirmaio(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/richiestafirmaio', data, httpOptions)
            .pipe(catchError(this.handleError('richiesta FirmaIO', null, true)));
    } 

    
    richiestafirmausign(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/richiestafirmausign', data, httpOptions)
            .pipe(catchError(this.handleError('richiesta U-Sign', null, true)));
    } 

    cancellazioneIstanzaFirmaUtente(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/cancellazioneistanzafirmautente', data, httpOptions)
            .pipe(catchError(this.handleError('cancellazione richiesta firma utente', null, true)));
    }     

    annullaContratto(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/annullacontratto', data, httpOptions)
            .pipe(catchError(this.handleError('annullaContratto', null, false)));
    }

    annullaAnnullaContratto(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/annullaannullacontratto', data, httpOptions)
            .pipe(catchError(this.handleError('annullaContratto', null, false)));
    }

    rinunciaCompenso(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/rinunciacompenso', data, httpOptions)
            .pipe(catchError(this.handleError('rinunciaCompenso', null, false)));
    }

    annullaRinuncia(data) {
        return this.http.post(AppConstants.baseApiURL + '/precontrattuale/annullarinuncia', data, httpOptions)
            .pipe(catchError(this.handleError('annullaRinuncia', null, false)));
    }


    richiestaInformazioni(data) {
        return this.http.post(AppConstants.baseApiURL + '/maillist', data, httpOptions)
            .pipe(catchError(this.handleError('richiestaInformazioni', null, false)));
    }

    sendInfoEmail(data): Observable<InfraResponse<any>> {
        return this.http.post<any>(this._baseURL + '/sendinfoemail/', data, httpOptions).pipe(
          catchError(this.handleError('sendEmailRichiestaCompilazione', null, true)),
        );
    }

    getIddg(id: number) {
        return this.http.get(this._baseURL + '/iddg/' + id);
    }
}
