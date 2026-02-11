import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { D2InailInterface } from './../interface/d2Inail.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IPrecontrStore } from '../interface/precontrattuale';

@Injectable()

export class D2InailService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/inail';
        }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getInail(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getInail', null, false)));
    }

    newInail(inail: IPrecontrStore<D2InailInterface>) {
        return this.http.post(this._baseURL, inail).pipe(catchError(this.handleError('newInail', null, false)));
    }

    updateInail(inail: D2InailInterface, idD2: number) {        
        return this.http.put(this._baseURL + '/' + idD2, inail).pipe(catchError(this.handleError('updateInail', null, false)));
    }

}
