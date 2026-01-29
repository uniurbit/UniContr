import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { PrecontrattualeInterface, IPrecontrattuale, InfraResponse, IPrecontrStore } from './../interface/precontrattuale';
import { ServiceQuery } from '../shared/query-builder/query-builder.interfaces';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { MessageService } from '../shared/message.service';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError } from 'rxjs/operators';
import { Insegnamento } from '../classes/insegnamento';
import { InsegnamentoInterface } from '../interface/insegnamento';
import { CoreSevice } from '../shared/base-service/base.service';
import { B2IncompatibilitaInterface } from '../interface/b2incompatibilita.interface';
import { B6InformativaInterface } from '../interface/b6informativa.interface';
import { D1InpsInterface } from '../interface/d1inps.interface';
import { Cacheable } from 'ts-cacheable';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()

export class PrecontrattualeService extends CoreSevice implements ServiceQuery {

  _baseURL: string;

  constructor(protected http: HttpClient, private auth: AuthService, public messageService: MessageService) {
    super(http, messageService);

    this._baseURL = AppConstants.baseApiURL + '/precontrattuale';
  }

  newPrecontr(precontr: PrecontrattualeInterface) {
    return this.http.post(this._baseURL, precontr);
  }

  getPrecontr(id: number) {
    return this.http.get(this._baseURL + '/' + id);
  }

  updatePrecontr(precontr: PrecontrattualeInterface) {
    return this.http.put(this._baseURL + '/' + precontr.insegn_id, precontr)
        .pipe(catchError(this.handleError('updatePrecontr')));
  }

  newPrecontrImportInsegnamento(pre: IPrecontrattuale): Observable<InfraResponse<IPrecontrattuale>> {
    return this.http.post<any>(this._baseURL + '/newprecontrimportinsegnamento', pre)
      .pipe(catchError(this.handleError('newPrecontrImportInsegnamento')));
  }

  newIncompat(incompat: IPrecontrStore<B2IncompatibilitaInterface>) {
    return this.http.post(this._baseURL + '/newincompat', incompat)
      .pipe(catchError(this.handleError('newIncompat')));
  }

  newPrivacy(incompat: IPrecontrStore<B6InformativaInterface>) {
    return this.http.post(this._baseURL + '/newprivacy', incompat)
      .pipe(catchError(this.handleError('newPrivacy')));
  }

  newInps(inps: IPrecontrStore<D1InpsInterface>) {
    return this.http.post(this._baseURL + '/newinps', inps)
      .pipe(catchError(this.handleError('newInps', null, false)));
  }

  newPrestazProfess(inps: IPrecontrStore<any>) {
    return this.http.post(this._baseURL + '/newprestazprofess', inps)
      .pipe(catchError(this.handleError('newPrestazProfess', null, false)));
  }
  

  terminaInoltra(data): Observable<InfraResponse<any>> {
    return this.http.post<any>(this._baseURL + '/terminainoltra', data)
      .pipe(catchError(this.handleError('terminaInoltra')));
  }

  @Cacheable()
  getTitulusDocumentURL(id): Observable<any> {
    return this.http.get(this._baseURL + '/gettitulusdocumenturl/' + id.toString(), httpOptions).pipe(
      catchError(this.handleError('getTitulusDocumentURL', null, true))
    );
  }

  // implementazione interfacccia ServiceQuery
  query(filters: any): Observable<any> {
    return this.http
    .post<any>(this._baseURL + '/query', filters, httpOptions).pipe(
      tap(sub => this.messageService.info('Ricerca effettuata con successo')),
      // NB. modifico aggiungendo la throw a true per rilanciare l'errore al chiamante come la finestra di lookup
      catchError(this.handleError('ricerca', null, true))
    );
  }

  export(model): Observable<any> {   
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    })
    return this.http
      .post(this._baseURL + '/export', model,{ headers, responseType: 'text'}).pipe(
        tap(sub => this.messageService.info('Export effettuato con successo')),
        catchError(this.handleError('export'))
      );
  }

  exportxls(model): Observable<any> {
    return this.http
      .post(this._baseURL + `/exportxls`, model, { responseType: 'blob'}).pipe(
        tap(sub => this.messageService.info('Export effettuato con successo')),
        catchError(this.handleError('export'))
      );
  }

  getById(id: any): Observable<any> {
    return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getById')));
    throw new Error('Method not implemented.');
  }

  getMetadata(): FormlyFieldConfig[] {
    return this.getQueryMetadata().concat( 
      {
        key: 'user.name',
        type: 'string',
        props: {
          label: 'Docente',
          required: true,
        }
      },
      // {
      //   key: 'insegnamento.tipo_atto',
      //   type: 'string',
      //   props: {
      //     label: 'Tipo atto',
      //     required: true,
      //   }
      // },
      {
        key: 'insegnamento.num_delibera',
        type: 'string',
        props: {
          label: 'Numero',
          required: true,
        }
      },
      {
        key: 'sorgente_rinnovo_per_id',
        type: 'string',
        props: {
          label: 'Sorgente per',
          required: true,
        }
      },      
      {
      key: 'currentState',
      type: 'select',
      props: {
        label: 'Stato corrente',
        required: true,
        options: [         
          {value: 'annullata',    label: 'Annullata'},
        ]
      }
    });
  }

  getQueryMetadata(): FormlyFieldConfig[] {
     return [
      {
        key: 'id',
        type: 'number',
        props: {
          label: '#',        
        }
      },    
      {
        key: 'insegnamento.coper_id',
        type: 'number',
        props: {
          label: 'Copertura',
          required: true,       
        }
      },
      {
        key: 'insegnamento.aa',
        type: 'input',
        props: {
          label: 'Anno',
          valueProp: 'value',
          labelProp: 'label',
          disabled: true, //perchè fixed property nella finestra di scelta delle precontr sorgente, andrebbe collegato alla proprietà fixed property
          options: this.getAnniAccademici()
        }
      },
      {
        key: 'insegnamento.tipo_contratto',
        type: 'string',
        props: {
          label: 'Tipologia',
          required: true,
        }
      },
      {
        key: 'insegnamento.motivo_atto',
        type: 'string',
        props: {
          label: 'Motivo Atto',
          required: true,
        }
      },
      {
        key: 'insegnamento.insegnamento',
        type: 'string',
        props: {
          label: 'Insegnamento',
          required: true,
        }
      },
      {
        key: 'insegnamento.cod_insegnamento',
        type: 'string',
        props: {
          label: 'Codice attività formativa',
          required: true,
        }
      },            
      {
        key: 'insegnamento.tipo_atto',
        type: 'string',
        props: {
          label: 'Tipo atto',
          required: true,
        }
      },      
      {
        key: 'insegnamento.data_ini_contr',
        type: 'date',
        props: {
          label: 'Data inizio',
          required: true,
        }
      },
      {
        key: 'insegnamento.data_fine_contr',
        type: 'date',
        props: {
          label: 'Data fine',
          required: true,    
        }
      },    
      {
        key: 'user.v_ie_ru_personale_id_ab',
        type: 'string',
        props: {
          label: 'Codice docente',
          required: true,
          disabled: true
        }
      },
     
     ]
  }

  downloadContrattoFirmato(id): Observable<any>{
    if (id) {
        return this.http.get( this._baseURL + '/downloadcontrattofirmato/' + id.toString()).pipe(catchError(this.handleError('download contratto', null, true)));
    }
    return of([]);
  }

}


