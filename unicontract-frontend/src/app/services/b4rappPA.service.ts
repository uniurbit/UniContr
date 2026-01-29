import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { B4RapportoPAInterface } from './../interface/b4rapportoPA.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()

export class B4RappPAService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
      super(http, messageService);
      this._baseURL = AppConstants.baseApiURL + '/rapppa';
    }

    getPrecontr(id: number) {
      return this.http.get(this._baseURL + '/' + id) 
        .pipe(catchError(this.handleError('getPrecontr', null, false)));
    }

    newRappPA(rapppa: B4RapportoPAInterface) {
        return this.http.post(this._baseURL, rapppa)
          .pipe(catchError(this.handleError('newRappPA', null, false)));
    }

    getRappPA(id: number) {
        return this.http.get(this._baseURL + '/details/' + id)
          .pipe(catchError(this.handleError('getRappPA', null, false)));
        
    }

    updateRappPA(rapppa: B4RapportoPAInterface, idB4: number) {
        rapppa['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + idB4, rapppa).pipe(catchError(this.handleError('updateRappPA', null, false)));
    }

    download(id: number): Observable<any> {
        if (id) {
          // tslint:disable-next-line:max-line-length
          return this.http.get( AppConstants.baseApiURL + '/attachments/download/' + id.toString()).pipe(catchError(this.handleError('download', null, false)));
        }
        return of([]);
      }

}
