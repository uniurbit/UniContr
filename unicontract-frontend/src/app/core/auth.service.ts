import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AppConstants } from '../app-constants';



interface LoginResponse {
  accessToken: string;
  accessExpiration: number;
}

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private authUrl: string;
    private loggedIn = new BehaviorSubject<boolean>(false);

    _username: string;
    _roles: string[]  = [''];
    _id: number;
    _email: string;
    _dips: string[];

    static TOKEN = 'tokenunicontr'

    constructor( private http: HttpClient,
                 public jwtHelper: JwtHelperService,
                 private router: Router,
                 private permissionsService: NgxPermissionsService ) {
        this.loggedIn.next(this.isAuthenticated());
        this.authUrl = AppConstants.baseURL;
    }

    login() {
        return this.http.get(`${this.authUrl}/loginSaml`, httpOptions)
        .subscribe(res => {
            console.log(res);
        });
    }

    loginWithToken(token: any) {
        localStorage.setItem(AuthService.TOKEN, token);
        this.loggedIn.next(this.isAuthenticated());
        this.reload();
    }

    refreshToken() {
        return this.http.post<any>(`${this.authUrl}/api/auth/refreshtoken`, {
          'refreshToken': this.getToken()
        }).pipe(tap((data) => {
          this.storeJwtToken(data.token);
        }));
    }

    reload(): any {
        if (this.isAuthenticated()) {
            const helper = new JwtHelperService();
            // console.log(helper);
            const decodedToken = helper.decodeToken(localStorage.getItem(AuthService.TOKEN));
            // console.log(decodedToken);
            this._email = decodedToken['email'];
            this._username = decodedToken['name'];
            this._roles = decodedToken['roles'];
            this._dips = decodedToken['dips'];
            // console.log(this.roles);
            this._id = decodedToken['id'];
            this.permissionsService.loadPermissions(this._roles);
        }
    }

    redirectFirstLogin(){

        const permissions = this.permissionsService.getPermissions();
        if (permissions['OP_APPROVAZIONE_AMM']){
            this.router.navigate(['home/dashboard/dashboarduffdocenti']);                    
        }else if (permissions['OP_APPROVAZIONE_ECONOMICA']){
            this.router.navigate(['home/dashboard/dashboardufftrattamenti']);
        }else if (permissions['OP_DIPARTIMENTALE']){
            this.router.navigate(['home/dashboard/dashboarddipartimento']);
        }else if (permissions['OP_RISUMANE']){
            this.router.navigate(['home/lineeguida/precontreditabile']);
        }else if (permissions['VIEWER']){
            this.router.navigate(['home']);
        }else{
            this.router.navigate(['home/lista-precontr-query']);
        }
    }


    resetFields() {
        this._username = '';
        this._id = null;
        this._roles = [];
        this._email = '';
    }

    getToken() {
       return localStorage.getItem(AuthService.TOKEN);
    }
    private storeJwtToken(jwt: string) {
        localStorage.setItem(AuthService.TOKEN, jwt);
    }

    logout() {

        this.http.get(this.authUrl + "api/auth/logout", httpOptions)
        .subscribe(res => {
            console.log(res);
        });

        localStorage.removeItem(AuthService.TOKEN);
        localStorage.clear();
        this.permissionsService.flushPermissions();
        this.resetFields();
        this.loggedIn.next(false);
    }

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    public get userid(): number {
        return this._id;
    }

    public get email(): string {
        return this._email;
    }

    public get username(): string {
        return this._username;
    }

    public get roles(): string[] {
        return this._roles;
    }

    public get dips(): string[] {
        return this._dips;
    }

    public isAuthenticated(): boolean {
        const token = localStorage.getItem(AuthService.TOKEN);
        // alert(token);
        // Check whether the token is expired and return
        // true or false
        return !this.jwtHelper.isTokenExpired(token);
    }

    /**
     * Handle any errors from the API
     */
    private handleError(err) {
        let errMessage: string;
        errMessage = '';
        // if (err instanceof Response) {
        //   let body = err.json() || '';
        //   let error = body.error || JSON.stringify(body);
        //   errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
        // } else {
        //   errMessage = err.message ? err.message : err.toString();
        // }

        return Observable.throw(errMessage);
    }
}
