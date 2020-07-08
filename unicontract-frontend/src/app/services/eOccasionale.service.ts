import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { EOccasionaleInterface } from './../interface/eOccasionale.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class EOccasionaleService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/occasionale';
        }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getOccasionale(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getOccasionale', null, false)));
    }

    newOccasionale(occasionale: EOccasionaleInterface) {
        return this.http.post(this._baseURL, occasionale).pipe(catchError(this.handleError('newOccasionale', null, false)));
    }

    updateOccasionale(occasionale: EOccasionaleInterface, idE: number) {
        occasionale['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idE, occasionale).pipe(catchError(this.handleError('updateOccasionale', null, false)));
    }

}
