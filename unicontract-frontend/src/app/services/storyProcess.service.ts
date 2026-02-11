import { MessageService } from './../shared/message.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from '../core';
import { StoryProcessInterface } from './../interface/storyProces.interface';
import { CoreSevice } from '../shared';
import { catchError } from 'rxjs/operators';

@Injectable()

export class StoryProcessService extends CoreSevice {

    _baseURL: string;

    constructor(protected http: HttpClient,
                private auth: AuthService,
                public messageService: MessageService) {
            super(http, messageService);
            this._baseURL = AppConstants.baseApiURL + '/story';
        }

    getStory(id: number) {
        return this.http.get(this._baseURL + '/' + id).pipe(catchError(this.handleError('getStory', null, false)));
    }   

    newStory(story: StoryProcessInterface) {
        return this.http.post(this._baseURL, story).pipe(catchError(this.handleError('newStory', null, false)));
    }

}
