import { Injectable } from '@angular/core';
import { P2rapporto } from './../classes/p2rapporto';
import { P2rapportoInterface } from './../interface/p2rapporto';
import { AppConstants } from 'src/app/app-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../core';
import { MessageService } from './../shared/message.service';
import { IPrecontrStore } from '../interface/precontrattuale';

@Injectable()

export class P2rapportoService extends CoreSevice  {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
                    super(http, messageService);
                    this._baseURL = AppConstants.baseApiURL + '/rapporto';
                }

    newRapporto(rapporto: P2rapportoInterface) {
        return this.http.post(this._baseURL, rapporto).pipe(catchError(this.handleError('newRapporto', null, false)));
    }

    getRapporto(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getRapporto', null, false)));
    }

    updateRapporto(rapporto: IPrecontrStore<P2rapportoInterface>, idP2: number) {
        rapporto['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idP2, rapporto).pipe(catchError(this.handleError('updateRapporto', null, false)));
    }

}
