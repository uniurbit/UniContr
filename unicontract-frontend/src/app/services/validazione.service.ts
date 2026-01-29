import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { ValidazioneInterface } from './../interface/validazioni.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class ValidazioneService extends CoreSevice {
    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/validazione';
        }

    updateValidation(validation: ValidazioneInterface) {
        validation['_method'] = 'PUT';
        return this.http.post(this._baseURL + '/' + validation.insegn_id, validation);
    }
}
