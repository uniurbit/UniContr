import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B1ConflittoInterface } from './../interface/b1conflitto.interface';
import { CoreSevice, MessageService } from '../shared';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()

export class B1ConflittoService extends CoreSevice {

  _baseURL: string;

  constructor(protected http: HttpClient, private auth: AuthService, public messageService: MessageService) {
    super(http,messageService)
    this._baseURL = AppConstants.baseApiURL + '/conflitto';
  }

  getPrecontr(id: number): Observable<any> {
    return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
  }

  newConflitto(conflitto: B1ConflittoInterface) {
    return this.http.post(this._baseURL, conflitto).pipe(catchError(this.handleError('newConflitto', null, false)));;
  }

  getConflitto(id: number) {
    return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getConflitto', null, false)));
  }

  updateConflitto(conflitto: B1ConflittoInterface, idB1: number) {
    conflitto['_method'] = 'PUT';
    return this.http.post(this._baseURL + '/' + idB1, conflitto).pipe(catchError(this.handleError('updateConflitto', null, false)));
  }

  generatePdf(id, kind): Observable<any>{    
    return this.http.get( this._baseURL  + '/generatepdf/'+id+'/'+kind)
      .pipe(catchError(this.handleError('generatePdf', null, false)));
  }

}
