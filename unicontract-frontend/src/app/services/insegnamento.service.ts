import { Observable } from 'rxjs';
import { Insegnamento } from './../classes/insegnamento';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InsegnamentoInterface, UpdateP1 } from './../interface/insegnamento';
import { InsegnUgovInterface } from './../interface/insegn-ugov';
import { environment } from '../../environments/environment';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { BaseService, ServiceQuery, MessageService, CoreSevice } from '../shared';
import { tap, catchError } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PrecontrattualeInterface, InfraResponse, IPrecontrStore } from '../interface/precontrattuale';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable()

export class InsegnamentoService extends CoreSevice implements ServiceQuery {

  _baseURL: string;

  constructor(protected http: HttpClient, private auth: AuthService, public messageService: MessageService) {
    super(http, messageService);

    this._baseURL = AppConstants.baseApiURL + '/insegnamenti';
  }

  getListaInsegnamenti() {
    // alert(this._baseURL);
    return this.http.get(this._baseURL).pipe(catchError(this.handleError('getListaInsegnamenti', null, false)));
  }

  getInsegnamento(id: number) {
    return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getInsegnamento', null, true)));
  }

  check(coper_id: number) {
    return this.http.get(this._baseURL + '/check/' + coper_id).pipe(catchError(this.handleError('check', null, false)));
  }

  updateInsegn(insegn: UpdateP1, id: number) {
    insegn['_method'] = 'PUT';
    return this.http.post(this._baseURL + '/upd/' + id, insegn).pipe(catchError(this.handleError('updateInsegn', null, false)));
  }

  updateInsegnamentoFromUgov(preStore: IPrecontrStore<any>){
    return this.http.post( AppConstants.baseApiURL + '/precontrattuale/updateinsegnamentofromugov', preStore).pipe(catchError(this.handleError('updateInsegnamentoFromUgov', null, false)));;
  }

  changeCoperturaFromUgov(preStore: IPrecontrStore<any>){
    return this.http.post( AppConstants.baseApiURL + '/precontrattuale/changecoperturafromugov', preStore).pipe(catchError(this.handleError('changeCoperturaFromUgov', null, false)));;
  }

  changeContatoreInsegnamentiManuale(preStore: IPrecontrStore<any>){
    return this.http.post( AppConstants.baseApiURL + '/precontrattuale/changecontatoreinsegnamentimanuale', preStore).pipe(catchError(this.handleError('changeContatoreInsegnamentiManuale', null, false)));;
  }

  newInsegn(insegn: InsegnamentoInterface) {
    return this.http.post(this._baseURL, insegn).pipe(catchError(this.handleError('newInsegn', null, false)));
  }

  //id è l'insegn_id 
  sendFirstEmail(id): Observable<InfraResponse<any>> {
    return this.http.get<any>(this._baseURL + '/sendfirstemail/' + id).pipe(
      catchError(this.handleError('sendEmailRichiestaCompilazione', null, true)),
    );
  }

  query(filters: any): Observable<any> {
    return this.http
    .post<any>(this._baseURL + '/query', filters, httpOptions).pipe(
      tap(sub => this.messageService.info('Ricerca effettuata con successo'))
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
