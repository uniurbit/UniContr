import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { Anagrafica } from './../classes/anagrafica';
import { AnagraficaInterface } from './../interface/anagrafica';
import { CoreSevice, MessageService } from '../shared';
import { catchError } from 'rxjs/operators';


@Injectable()

export class AnagraficaService extends CoreSevice {

  anagrafica: Anagrafica[] = [];

  _baseURL: string;

  constructor(protected http: HttpClient, public messageService: MessageService) {
    super(http, messageService);
    this._baseURL = AppConstants.baseApiURL + '/anagrafica';
  }


  getAnagrafica(idab: string): any {
    return this.http.get(this._baseURL + '/' + idab).pipe(catchError(this.handleError('getAnagrafica', null, false)));
  }

}
