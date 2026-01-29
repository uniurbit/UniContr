import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B3RapportoStudioInterface } from './../interface/b3rappStudio.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class B3RappStudioUnivService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
      super(http, messageService);
      this._baseURL = AppConstants.baseApiURL + '/studio';
    }

    getPrecontr(id: number) {
      return this.http.get(this._baseURL + '/' + id)
        .pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    newRappStudio(studio: B3RapportoStudioInterface) {
      return this.http.post(this._baseURL, studio)
      .pipe(catchError(this.handleError('newRappStudio', null, false)));
    }

    getRappStudio(id: number) {
      return this.http.get(this._baseURL + '/details/' + id)
        .pipe(catchError(this.handleError('getRappStudio', null, false)));
    }

    updateRappStudio(studio: B3RapportoStudioInterface, idB3: number) {
      studio['_method'] = 'PUT';
      return this.http.post(this._baseURL + '/' + idB3, studio)
      .pipe(catchError(this.handleError('updateRappStudio', null, false)));
    }
}
