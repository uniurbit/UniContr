import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { RuoloDocente } from './../classes/ruoloDocente';
import { RuoloDocenteInterface } from './../interface/ruoloDocente.interface';

@Injectable()

export class RuoloDocenteService {

  _baseURL: string;

  constructor(private http: HttpClient) {
    this._baseURL = AppConstants.baseApiURL + '/ruolodocente';
  }

  nuovoRuoloDocente(ruolodocente: RuoloDocenteInterface) {
    return this.http.post(this._baseURL, ruolodocente);
  }


}
