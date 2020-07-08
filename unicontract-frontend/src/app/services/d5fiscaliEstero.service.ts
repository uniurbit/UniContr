import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { D5FiscaliEsteroInterface } from './../interface/d5fiscaliEstero.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IPrecontrStore } from '../interface/precontrattuale';

@Injectable()

export class D5FiscaliEsteroService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
                    super(http, messageService);
                    this._baseURL = AppConstants.baseApiURL + '/fiscoestero';
                }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getDatiFiscaliEstero(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getDatiFiscaliEstero', null, false)));
    }

    newDatiFiscaliEstero(fiscali: IPrecontrStore<any>) {
        return this.http.post(this._baseURL, fiscali)
        .pipe(catchError(this.handleError('newDatiFiscaliEstero', null, false)));
    }

    updateDatiFiscaliEstero(fiscali: D5FiscaliEsteroInterface, idD5: number) {
        fiscali['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idD5, fiscali)
        .pipe(catchError(this.handleError('updateDatiFiscaliEstero', null, false)));
    }

}
