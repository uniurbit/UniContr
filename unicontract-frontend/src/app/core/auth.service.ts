import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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

    constructor(private http: HttpClient,
        public jwtHelper: JwtHelperService,
        private router: Router,
        private permissionsService: NgxPermissionsService) {
 
        this.authUrl = AppConstants.baseURL;
        // Check if localStorage is available
        if (this.isLocalStorageAvailable()) {
            this.loggedIn.next(this.isAuthenticated());
        } else {          
            console.warn('LocalStorage is not accessible');           
        } 
    }

    // Check if localStorage is accessible
    public isLocalStorageAvailable(logerror = false, token: string = null): boolean {
        try {
            const test = '__test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            if (logerror && token){
                this.logErrorWithToken(e, 'LocalStorage non è accessibile in questo ambiente',token);
            } else if (logerror) {
                this.logError(e, 'LocalStorage non è accessibile in questo ambiente');
            }            
            return false; // If an error is thrown, localStorage is unavailable
        }
    }


    login() {
        return this.http.get(`${this.authUrl}/loginSaml`, httpOptions)
            .subscribe(res => {
                console.log(res);
            });
    }

    cambiaUtente(id) {
        return this.http.post<any>(`${this.authUrl}api/auth/cambiautente`, { id: id }, httpOptions).pipe(tap((data) => {
            localStorage.removeItem(AuthService.TOKEN);
            localStorage.clear();
            sessionStorage.clear();
            this.permissionsService.flushPermissions();
            this.resetFields();
            this.loggedIn.next(false);

            this.loginWithToken(data.token);
        })).subscribe(res => {
            console.log(res);
        });
    }

    refreshToken() {
        return this.http.post<any>(`${this.authUrl}api/auth/refreshtoken`, {
            'refreshToken': this.getToken()
        }).pipe(tap((data) => {
            this.storeJwtToken(data.token);
        }));
    }

    loginWithToken(token: any) {
        // console.log(localStorage.setItem(AuthService.TOKEN, token));
        try {
            localStorage.setItem(AuthService.TOKEN, token);
        } catch (e) {
            console.error("Error saving token to localStorage:", e);
            this.logout({ reason: "Error saving token to localStorage", additionalData: e });  // Handle accordingly if localStorage fails
        }
        this.loggedIn.next(this.isAuthenticated());
        this.reload();
    }

    checkpermission(perm) {
        let permissions = this.permissionsService.getPermissions();
        if (permissions[perm]) {
            return true;
        }
        return false;
    }

    reload(): void {
        if (this.isAuthenticated()) {
            try {
                const token = localStorage.getItem(AuthService.TOKEN);
                if (token) {
                    const helper = new JwtHelperService();
                    const decodedToken = helper.decodeToken(token);

                    if (decodedToken) {
                        // Set user-related values based on the decoded token
                        this._email = decodedToken['email'];
                        this._username = decodedToken['name'];
                        this._roles = decodedToken['roles'];
                        this._dips = decodedToken['dips'];
                        this._id = decodedToken['id'];

                        // Load permissions based on user roles
                        this.permissionsService.loadPermissions(this._roles);
                    } else {
                        console.error("Error decoding token: Token is invalid or malformed.");
                        this.logout({ reason: "Error decoding token: Token is invalid or malformed." });  // Log out if the token is invalid
                        this.router.navigate(['home']);
                    }
                } else {
                    console.error("No token found in localStorage. Logging out.");
                    this.logout({ reason: "No token found in localStorage. Logging out." });  // Log out if no token is present
                    this.router.navigate(['home']);
                }
            } catch (e) {
                console.error("Error reloading user details:", e);
                this.logout({ reason: "Error reloading user details", additionalData: e });  // Log out if any error occurs during reload
                this.router.navigate(['home']);
            }
        }
    }

    redirectFirstLogin(redirect){

        if (redirect && redirect != 'home' && redirect != '/home' && redirect != ''){
            console.log(redirect);
            this.router.navigateByUrl(redirect);       
            return;                         
        }


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
        }else if (permissions['OP_DOCENTE']){
            this.router.navigate(['home/lista-doc-precontr-query']);
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

    //chiamato dal token interceptor
    getToken() {
        try {
            const token = localStorage.getItem(AuthService.TOKEN);
            return token;
        } catch (error) {
            console.error('Errore di accesso al localStorage getToken:', error);
            return null;  // Return null or handle it appropriately
        }
    }

    private storeJwtToken(jwt: string) {
        localStorage.setItem(AuthService.TOKEN, jwt);
    }

    logout(logoutData: { reason: string, additionalData?: any } = null) {
        
        this.http.post(this.authUrl + "api/auth/logout", logoutData, httpOptions)
            .subscribe(res => {
                console.log(res);
            });

        localStorage.removeItem(AuthService.TOKEN);
        localStorage.clear();
        sessionStorage.clear();
        this.permissionsService.flushPermissions();
        this.resetFields();
        this.loggedIn.next(false);
    }

    logErrorWithToken(error: any, message: string = '', token: string) {
        const errorPayload = {
            error: error.message || error,
            message: message
        };

        // Adding the new permission key in the request headers
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Using the token in the Authorization header
          });

        this.http.post(this.authUrl + 'api/auth/logerror', errorPayload, { headers }).subscribe();
    }

    
    logError(error: any, message: string = '') {
        const errorPayload = {
            error: error.message || error,
            message: message
        };

        // Adding the new permission key in the request headers
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',            
          });

        this.http.post(this.authUrl + 'api/auth/logerror', errorPayload, { headers }).subscribe();
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
        try {

            let token = null;
            try {
                token = localStorage.getItem(AuthService.TOKEN);
            } catch (e) {              
                return false;
            }

            // If there's no token, the user is not authenticated
            if (!token) {
                return false;
            }

            // Check whether the token is expired
            return !this.jwtHelper.isTokenExpired(token);
        } catch (e) {
            console.error("Error checking authentication");            
            return false;
        }
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

        return throwError(errMessage);
    }
}
