import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { D3TributariInterface } from './../interface/d3tributari.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()

export class D3TributariService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
                    super(http, messageService);
                    this._baseURL = AppConstants.baseApiURL + '/tributari';
                }

    getPrecontr(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    getDatiTributari(id: number) {
        return this.http.get(this._baseURL + '/details/' + id).pipe(catchError(this.handleError('getDatiTributari', null, false)));
    }

    newDatiTributari(tribut: D3TributariInterface) {
        return this.http.post(this._baseURL, tribut).pipe(catchError(this.handleError('newDatiTributari', null, false)));
    }

    updateDatiTributari(tribut: D3TributariInterface, idD3: number) {        
        return this.http.put(this._baseURL + '/' + idD3, tribut).pipe(catchError(this.handleError('updateDatiTributari', null, false)));
    }

}
