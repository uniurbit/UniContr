
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Cacheable, CacheBuster } from 'ngx-cacheable';
import { ServiceQuery, ServiceEntity } from '../query-builder/query-builder.interfaces';
import { MessageService } from '../message.service';
import { AppConstants } from 'src/app/app-constants';
import { create } from 'domain';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class CoreSevice {
  _baseURL: string;

  constructor(protected http: HttpClient, public messageService: MessageService) {
    this._baseURL = AppConstants.baseApiURL;
  }


   /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  protected handleError<T>(operation = 'operation', result?: T, retrow: boolean = false) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.messageService.error(`L'operazione di ${operation} è terminata con errori: ${error.message}`, true, false, error);
      if (!retrow) {
        return of(result as T);
      } else {
        return throwError(error);
      }
    };
  }

  /**
   * 
   * @param from: int anno di inizio 
   * @returns array [
          {value: '2016', label: '2016 / 2017'},
          {value: '2017', label: '2017 / 2018'},
          {value: '2018', label: '2018 / 2019'},
          {value: '2019', label: '2019 / 2020'},
          {value: '2020', label: '2020 / 2021'},
          {value: '2021', label: '2021 / 2022'},
        ]
   */
  getAnniAccademici(from = 2016): Observable<any[]> {
      const years = [];
      const currentYear = new Date().getFullYear();
      for (let index = 0; index <= currentYear - from; index++) {
          years.push({value: (from + index).toString(), label: `${from + index} / ${from + index + 1}`});
      }
      return of (years);
  }
}

export const cacheBusterNotifier = new Subject();
@Injectable()
export class BaseService extends CoreSevice implements ServiceQuery, ServiceEntity {

  protected basePath: string;

  getMetadata(): FormlyFieldConfig[] {
    return [];
  }

  @Cacheable({
    cacheBusterObserver: cacheBusterNotifier    
  })
  protected getByIdInternal(id: any, basePath: string): Observable<any>{
    return this.http
    .get(this._baseURL +  `/${basePath}/` + id.toString(), httpOptions).pipe(
      tap(sub => {
        if (sub) {
          this.messageService.info('Lettura permesso effettuata con successo');
        } else {
          this.messageService.info('Permesso non trovato');
        }
      }),
      catchError(this.handleError('getById'))
    );
  }

  getById(id: any): Observable<any> {
    return this.getByIdInternal(id,this.basePath);
  }

  constructor(protected http: HttpClient,
              public messageService: MessageService,
              public confirmationDialogService: ConfirmationDialogService) {
     super(http, messageService);
  }

  clearMessage() {
    this.messageService.clear();
  }

  query(model): Observable<any> {
    return this.http
      .post<any>(this._baseURL + `/${this.basePath}/query`, model, httpOptions).pipe(
        tap(sub => this.messageService.info('Ricerca effettuata con successo')),
        // NB. modifico aggiungendo la throw a true per rilanciare l'errore al chiamante come la finestra di lookup
        catchError(this.handleError('query', null, true))
      );
  }

  export(model): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .post(this._baseURL + `/${this.basePath}/export`, model, { headers, responseType: 'text'}).pipe(
        tap(sub => this.messageService.info('Export effettuato con successo')),
        catchError(this.handleError('export'))
      );
  }

  exportxls(model): Observable<any> {
    return this.http
      .post(this._baseURL + `/${this.basePath}/exportxls`, model, { responseType: 'blob'}).pipe(
        tap(sub => this.messageService.info('Export effettuato con successo')),
        catchError(this.handleError('export'))
      );
  }

  store(model: any, retrow: boolean = false): Observable<any> {
    // crea il modello
    const url = `${this._baseURL}/${this.basePath}`;
    let res = this.http.post<any>(url, model, httpOptions)
      .pipe(
        tap(sub => {
          this.messageService.info('Creazione effettuata con successo');
        }),
        catchError(this.handleError('store', model, retrow))
      );
    return res;
  }

  @CacheBuster({
    cacheBusterNotifier: cacheBusterNotifier
  })
  update(model: any, id: number, retrow: boolean = false): Observable<any> {
    if (id) {
      // aggiorna il modello esiste PUT
      const url = `${this._baseURL}/${this.basePath}/${id}`;
      let res = this.http.put<any>(url, model, httpOptions)
        .pipe(
          tap(sub => {
            this.messageService.info('Aggiornamento effettuato con successo');
            return sub;
          }),
          catchError(this.handleError('update', model, retrow))
        );
      return res;
    } else {
      return this.store(model, retrow);
    }
  }

  remove(id: number) {
    return this.http.delete(this._baseURL + `/${this.basePath}/` + id.toString()).pipe(
      tap(ok => {
        this.messageService.clear();
        this.messageService.info('Eliminazione effettuata con successo');
      }),
      catchError(
        this.handleError('remove', null, true)
      )
    );
  }

}
