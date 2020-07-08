import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AnagraficaLocal } from './../classes/anagrafica-local';
import { AnagraficaLocalInterface } from './../interface/anagrafica-local.interface';
import { Observable, of } from 'rxjs';
import { CoreSevice, MessageService } from '../shared';
import { catchError, tap } from 'rxjs/operators';


@Injectable()

export class AnagraficaLocalService extends CoreSevice {

  _baseURL: string;

  constructor(protected http: HttpClient, public messageService: MessageService) {
    super(http, messageService);
    this._baseURL = AppConstants.baseApiURL + '/anagrafica';
  }

  getAnagraficaLocal(id: string) {
    return this.http.get(this._baseURL + '/local/' + id).pipe(catchError(this.handleError('getAnagraficaLocal', null, false)));
  }

  newAnagraficaLocal(anagraficaLocal: AnagraficaLocalInterface) {
    return this.http.post(this._baseURL, anagraficaLocal).pipe(catchError(this.handleError('anagraficaLocal', null, false)));
  }

  updateAnagraficaLocal(anagraficaLocal: AnagraficaLocalInterface, idA1: number) {
    anagraficaLocal['_method'] = 'PUT';
    // tslint:disable-next-line:max-line-length
    return this.http.post(this._baseURL + '/' + idA1, anagraficaLocal).pipe(catchError(this.handleError('updateAnagraficaLocal', null, false)));
}

  download(id): Observable<any> {
    if (id) {
      // tslint:disable-next-line:max-line-length
      return this.http.get( AppConstants.baseApiURL + '/attachments/download/' + id.toString()).pipe(catchError(this.handleError('download', null, false)));
    }
    return of([]);
  }

  deleteFile(id: number): Observable<any> {
    const url = `${AppConstants.baseApiURL  + '/attachments/'}${id}`;
    const res = this.http.delete<any>(url)
      .pipe(
        tap(sub =>
          this.messageService.info('Eliminazione documento effettuata con successo')
        ),
        catchError(this.handleError('deleteFile', null, true))
      );
    return res;
  }
}
