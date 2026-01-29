import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B2IncompatibilitaInterface } from './../interface/b2incompatibilita.interface';
import { IPrecontrStore } from '../interface/precontrattuale';
import { CoreSevice, MessageService } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class B2IncompatibilitaService extends CoreSevice {

  _baseURL: string;

  constructor(protected http: HttpClient, public messageService: MessageService) {
    super(http, messageService);
    this._baseURL = AppConstants.baseApiURL + '/incompat';
  }


  getPrecontr(id: number) {
    return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
  }

  newIncompat(incompat: IPrecontrStore<B2IncompatibilitaInterface>) {
    return this.http.post(this._baseURL, incompat).pipe(catchError(this.handleError('newIncompat', null, false)));
  }

  getIncompat(id: number) {
    return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getIncompat', null, false)));
  }

  updateIncompat(incompat: B2IncompatibilitaInterface, idB2: number) {
    incompat['_method'] = 'PUT';
    return this.http.post(this._baseURL + '/' + idB2, incompat).pipe(catchError(this.handleError('updateIncompat', null, false)));
  }

}
