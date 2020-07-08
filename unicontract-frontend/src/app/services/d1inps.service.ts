import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { D1InpsInterface } from './../interface/d1inps.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()

export class D1InpsService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/inps';
        }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getInps(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getInps', null, false)));
    }

    newInps(inps: D1InpsInterface) {
        return this.http.post(this._baseURL, inps).pipe(catchError(this.handleError('newInps', null, false)));
    }

    updateInps(inps: D1InpsInterface, idD1: number) {
        inps['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idD1, inps).pipe(catchError(this.handleError('updateInps', null, false)));
    }

    download(id: number): Observable<any> {
        if (id) {
            // tslint:disable-next-line:max-line-length
            return this.http.get( AppConstants.baseApiURL + '/attachments/download/' + id.toString()).pipe(catchError(this.handleError('download', null, false)));
        }
        return of([]);
    }


}
