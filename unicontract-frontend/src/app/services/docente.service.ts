import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { Docente } from '../classes/docente';
import { DocenteInterface } from './../interface/docente.interface';

@Injectable()

export class DocenteService {

  docente: Docente[] = [];

  _baseURL: string;

  constructor(private http: HttpClient) {
    this._baseURL = AppConstants.baseApiURL + '/docente';
  }

  nuovoDocente(docente: DocenteInterface) {
    return this.http.post(this._baseURL, docente);
  }

  getDocente(id_ab: number) {
    return this.http.get(this._baseURL + '/' + id_ab);
  }


}
