import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { PrecontrattualeInterface, IPrecontrattuale, InfraResponse, IPrecontrStore } from './../interface/precontrattuale';
import { ServiceQuery } from '../shared/query-builder/query-builder.interfaces';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { MessageService } from '../shared/message.service';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/operators';
import { Insegnamento } from '../classes/insegnamento';
import { InsegnamentoInterface } from '../interface/insegnamento';
import { CoreSevice } from '../shared/base-service/base.service';
import { B2IncompatibilitaInterface } from '../interface/b2incompatibilita.interface';
import { B6InformativaInterface } from '../interface/b6informativa.interface';
import { D1InpsInterface } from '../interface/d1inps.interface';
import { Cacheable } from 'ngx-cacheable';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class PrecontrattualeService extends CoreSevice implements ServiceQuery {

  _baseURL: string;

  constructor(protected http: HttpClient, private auth: AuthService, public messageService: MessageService) {
    super(http, messageService);

    this._baseURL = AppConstants.baseApiURL + '/precontrattuale';
  }

  newPrecontr(precontr: PrecontrattualeInterface) {
    return this.http.post(this._baseURL, precontr);
  }

  getPrecontr(id: number) {
    return this.http.get(this._baseURL + '/' + id);
  }

  updatePrecontr(precontr: PrecontrattualeInterface) {
    return this.http.put(this._baseURL + '/' + precontr.insegn_id, precontr);
  }

  newPrecontrImportInsegnamento(pre: IPrecontrattuale): Observable<InfraResponse<IPrecontrattuale>> {
    return this.http.post<any>(this._baseURL + '/newprecontrimportinsegnamento', pre)
      .pipe(catchError(this.handleError('newPrecontrImportInsegnamento')));
  }

  newIncompat(incompat: IPrecontrStore<B2IncompatibilitaInterface>) {
    return this.http.post(this._baseURL + '/newincompat', incompat)
      .pipe(catchError(this.handleError('newIncompat')));
  }

  newPrivacy(incompat: IPrecontrStore<B6InformativaInterface>) {
    return this.http.post(this._baseURL + '/newprivacy', incompat)
      .pipe(catchError(this.handleError('newPrivacy')));
  }

  newInps(inps: IPrecontrStore<D1InpsInterface>) {
    return this.http.post(this._baseURL + '/newinps', inps)
      .pipe(catchError(this.handleError('newInps', null, false)));
  }

  newPrestazProfess(inps: IPrecontrStore<any>) {
    return this.http.post(this._baseURL + '/newprestazprofess', inps)
      .pipe(catchError(this.handleError('newPrestazProfess', null, false)));
  }
  

  terminaInoltra(data): Observable<InfraResponse<any>> {
    return this.http.post<any>(this._baseURL + '/terminainoltra', data)
      .pipe(catchError(this.handleError('terminaInoltra')));
  }

  @Cacheable()
  getTitulusDocumentURL(id): Observable<any> {
    return this.http.get(this._baseURL + '/gettitulusdocumenturl/' + id.toString(), httpOptions).pipe(
      catchError(this.handleError('getTitulusDocumentURL', null, true))
    );
  }

  // implementazione interfacccia ServiceQuery
  query(filters: any): Observable<any> {
    return this.http
    .post<any>(this._baseURL + '/query', filters, httpOptions).pipe(
      tap(sub => this.messageService.info('Ricerca effettuata con successo')),
      // NB. modifico aggiungendo la throw a true per rilanciare l'errore al chiamante come la finestra di lookup
      catchError(this.handleError('ricerca', null, true))
    );
  }

  export(model): Observable<any> {   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http
      .post(this._baseURL + '/export', model,{ headers, responseType: 'text'}).pipe(
        tap(sub => this.messageService.info('Export effettuato con successo')),
        catchError(this.handleError('export'))
      );
  }

  exportxls(model): Observable<any> {
    return this.http
      .post(this._baseURL + `/exportxls`, model, { responseType: 'blob'}).pipe(
        tap(sub => this.messageService.info('Export effettuato con successo')),
        catchError(this.handleError('export'))
      );
  }

  getById(id: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  getMetadata(): FormlyFieldConfig[] {
    throw new Error('Method not implemented.');
  }


}


