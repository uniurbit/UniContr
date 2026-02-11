import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B5StatoPensionamentoInterface } from './../interface/b5statoPensionamento.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { IPrecontrStore } from '../interface/precontrattuale';

@Injectable()

export class B5StatoPensionamentoService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/pension';
        }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getStatoPension(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getStatoPension', null, false)));
    }

    newStatoPensionam(pensionam:  IPrecontrStore<any>) {
        return this.http.post(this._baseURL, pensionam).pipe(catchError(this.handleError('newStatoPensionam', null, false)));
    }

    updateStatoPensionam(pensionam: B5StatoPensionamentoInterface, idB5: number) {
        // tslint:disable-next-line:max-line-length
        return this.http.put(this._baseURL + '/' + idB5, pensionam).pipe(catchError(this.handleError('updateStatoPensionam', null, false)));
    }

}
