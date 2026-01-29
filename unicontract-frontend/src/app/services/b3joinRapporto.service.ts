import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B3JoinRapportoInterface } from './../interface/b3joinRapporto.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { MessageService } from './../shared/message.service';

@Injectable()

export class B3JoinRapportoService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
                  super(http, messageService);
      this._baseURL = AppConstants.baseApiURL + '/rappUni';
    }

    newRapporto(rapporto: B3JoinRapportoInterface) {
      return this.http.post(this._baseURL, rapporto).pipe(catchError(this.handleError('newRapporto', null, false)));
    }

    getRapporto(id: number) {
      return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getRapporto', null, false)));
    }

    listaRapporti(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('listaRapporti', null, false)));
    }

    updateRapporto(rapporto: B3JoinRapportoInterface, id: number) {
        rapporto['_method'] = 'PUT';
      return this.http.post(this._baseURL + '/' + id, rapporto).pipe(catchError(this.handleError('updateRapporto', null, false)));
    }

    deleteRapporto(id: number) {
      const data = {_method: 'DELETE'};
      return this.http.post(this._baseURL + '/' + id, data).pipe(catchError(this.handleError('deleteRapporto', null, false)));
    }
}
