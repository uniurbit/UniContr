import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { Pagamento } from './../classes/pagamento';
import { A2ModPagamento } from './../interface/pagamento';
import { MessageService, CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';


@Injectable()

export class PagamentoService extends CoreSevice  {

  _baseURL: string;

  constructor(protected http: HttpClient, public messageService: MessageService) {
        super(http, messageService);
    this._baseURL = AppConstants.baseApiURL + '/pagamento';
  }

  getPagamento(idab: string, idins: string) {
    return this.http.get(this._baseURL + '/' + idab + '/' + idins).pipe(catchError(this.handleError('getPagamento', null, false)));
  }

  getPagamentoLocal(id: number) {
    return this.http.get(this._baseURL + '/local/' + id).pipe(catchError(this.handleError('getPagamentoLocal', null, false)));
  }

  newPagamento(pagamento: A2ModPagamento) {
    return this.http.post(this._baseURL, pagamento).pipe(catchError(this.handleError('newPagamento', null, false)));
  }

  updatePagamentoLocal(pagamento: A2ModPagamento, idA2: number) {    
    return this.http.put(this._baseURL + '/local/' + idA2, pagamento).pipe(catchError(this.handleError('updatePagamentoLocal', null, false)));
  }

}
