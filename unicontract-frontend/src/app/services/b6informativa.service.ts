import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B6InformativaInterface } from './../interface/b6informativa.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class B6InformativaService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/privacy';
        }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('newPgetPrecontrrivacy', null, false)));
    }

    getPrivacy(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getPrivacy', null, false)));
    }

    newPrivacy(privacy: B6InformativaInterface) {
        return this.http.post(this._baseURL, privacy).pipe(catchError(this.handleError('newPrivacy', null, false)));
    }

    updatePrivacy(privacy: B6InformativaInterface, idB6: number) {
        privacy['_method'] = 'PUT';
        // tslint:disable-next-line:max-line-length
        return this.http.post(this._baseURL + '/' + idB6, privacy).pipe(catchError(this.handleError('updatePrivacy', null, false)));
    }


}
