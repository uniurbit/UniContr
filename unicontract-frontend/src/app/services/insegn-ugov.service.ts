import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InsegnUgovInterface } from './../interface/insegn-ugov';
import { InsegnUgov } from './../classes/insegn-ugov';
import { AppConstants } from 'src/app/app-constants';
import { Cacheable } from 'ts-cacheable';
import { CoreSevice } from '../shared/base-service/base.service';
import { MessageService } from '../shared/message.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ServiceQuery } from '../shared';
import { FormlyFieldConfig } from '@ngx-formly/core';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
/*
@Injectable({
  providedIn: 'root'
})
*/
export class InsegnUgovService  extends CoreSevice implements ServiceQuery  {

  ugovins: InsegnUgov[] = [];

  _baseURL: string;

  constructor(protected http: HttpClient, public messageService: MessageService) {
    super(http, messageService);
    this._baseURL = AppConstants.baseApiURL + '/copertura';
  }

  @Cacheable()
  getListaInsegnamentiUgov(aa_off_id: string) {
    return this.http.get(this._baseURL + '/anno/' + aa_off_id).pipe(catchError(this.handleError('getListaInsegnamentiUgov', null, true)));
  }

  getInsegnamentoUgov(coper_id: number, aa_off_id: string) {
    return this.http.get(this._baseURL + '/' + coper_id).pipe(catchError(this.handleError('getInsegnamentoUgov', null, true)));
  }

  getRefreshUgovData(coper_id: number) {
    return this.http.get(this._baseURL + '/reload/' + coper_id).pipe(catchError(this.handleError('getRefreshUgovData', null, true)));
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
  export(filters: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  getById(id: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  getMetadata(): FormlyFieldConfig[] {
    throw new Error('Method not implemented.');
  }
  exportxls(filters: any): Observable<any> {
    throw new Error("Method not implemented.");
  }

}
