import { Injectable } from "@angular/core";
import { AppConstants } from "../app-constants";

import { MessageService, CoreSevice } from "../shared";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../core";


const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

@Injectable()
export class DashboardService extends CoreSevice {

  constructor(protected http: HttpClient, public messageService: MessageService, public auth: AuthService) {
    super(http,messageService)
  }
  
 
}