import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { CPrestazProfessInterface } from './../interface/cPrestazProfessionale.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class CPrestazProfessService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/cpiva';
        }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getPrestazProfess(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getPrestazProfess', null, false)));
    }

    newPrestazProfess(piva: CPrestazProfessInterface) {
        return this.http.post(this._baseURL, piva).pipe(catchError(this.handleError('newPrestazProfess', null, false)));
    }

    updatePrestazProfess(piva: CPrestazProfessInterface, idC: number) {
        piva['_method'] = 'PUT';
        // tslint:disable-next-line:max-line-length
        return this.http.post(this._baseURL + '/' + idC, piva).pipe(catchError(this.handleError('updatePrestazProfess', null, false)));
    }


}
