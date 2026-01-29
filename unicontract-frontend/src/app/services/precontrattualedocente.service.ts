import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { PrecontrattualeInterface, IPrecontrattuale, InfraResponse, IPrecontrStore } from '../interface/precontrattuale';
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
import { Cacheable } from 'ts-cacheable';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class PrecontrattualeDocenteService extends CoreSevice implements ServiceQuery {

  _baseURL: string;

  constructor(protected http: HttpClient, private auth: AuthService, public messageService: MessageService) {
    super(http, messageService);

    this._baseURL = AppConstants.baseApiURL + '/precontrattualedocente';
  }

  getPrecontr(id: number) {
    return this.http.get(this._baseURL + '/' + id);
  }

  @Cacheable()
  getTitulusDocumentURL(id): Observable<any> {
    return this.http.get(AppConstants.baseApiURL + '/precontrattuale' + '/gettitulusdocumenturl/' + id.toString(), httpOptions).pipe(
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

  downloadContrattoFirmato(id): Observable<any>{
    if (id) {
        return this.http.get( AppConstants.baseApiURL + '/precontrattuale' + '/downloadcontrattofirmato/' + id.toString()).pipe(catchError(this.handleError('download contratto', null, true)));
    }
    return of([]);
  }

}


