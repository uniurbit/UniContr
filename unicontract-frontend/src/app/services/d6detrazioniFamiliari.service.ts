import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { D6DetrazioniFamiliariInterface } from './../interface/d6detrazionifamiliari.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()

export class D6DetrazioniFamiliariService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
                    super(http, messageService);
                    this._baseURL = AppConstants.baseApiURL + '/familiari';
                }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getDatiDetrazioni(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getDatiDetrazioni', null, false)));
    }

    newDatiDetrazioni(detrazioni: D6DetrazioniFamiliariInterface) {
        return this.http.post(this._baseURL, detrazioni)
        .pipe(catchError(this.handleError('newDatiDetrazioni', null, false)));
    }

    updateDatiDetrazioni(detrazioni: D6DetrazioniFamiliariInterface, idD6: number) {
        detrazioni['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idD6, detrazioni)
        .pipe(catchError(this.handleError('updateDatiDetrazioni', null, false)));
    }

}
