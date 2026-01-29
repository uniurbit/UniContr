import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { EmailListInterface } from './../interface/emailList.interface';

@Injectable()

export class EmailListService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/maillist';
        }

    getEmailList(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getEmailList', null, false)));
    }

    // getDataInsegn(id: number) {
    //     return this.http.get(this._baseURL + '/prec/' + id);
    // }

    storeEmailInfo(email: EmailListInterface) {
        return this.http.post(this._baseURL, email).pipe(catchError(this.handleError('storeEmailInfo', null, false)));
    }

}
