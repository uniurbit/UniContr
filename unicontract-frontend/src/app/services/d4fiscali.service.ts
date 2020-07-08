import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { D4FiscaliInterface } from './../interface/d4fiscali.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IPrecontrStore } from '../interface/precontrattuale';

@Injectable()

export class D4FiscaliService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
                    super(http, messageService);
                    this._baseURL = AppConstants.baseApiURL + '/fiscali';
                }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getDatiFiscali(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getDatiFiscali', null, false)));
    }

    newDatiFiscali(fiscali: IPrecontrStore<any>) {
        return this.http.post(this._baseURL, fiscali).pipe(catchError(this.handleError('newDatiFiscali', null, false)));
    }

    updateDatiFiscali(fiscali: any, idD4: number) {
        fiscali['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idD4, fiscali).pipe(catchError(this.handleError('updateDatiFiscali', null, false)));
    }

}
