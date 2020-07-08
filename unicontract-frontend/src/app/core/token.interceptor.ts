import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError, switchMap, filter, take, flatMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { error } from 'util';
import { AppConstants } from '../app-constants';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, public auth: AuthService, private toastr: ToastrService) { }

  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //    return next.handle(req);

    return next.handle(req).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          console.log('processing response', ev);
        }
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:

              // We don't want to refresh token for some requests like login or refresh token itself
              // So we verify url and we throw an error if it's the case
              if (
                req.url.includes("refreshtoken") ||
                req.url.includes("login") ||
                req.url.includes("logout")
              ) {
                // We do another check to see if refresh token failed
                // In this case we want to logout user and to redirect it to login page
                if (req.url.includes("refreshtoken")) {
                  this.auth.logout();
                }
                return throwError(error);
              }

              return this.handle401Error(req, next);
             
              break;
            case 500:
              //errore login oracle
              if ((error.error.message as string).includes('ORA-01017')) {
                const router = this.injector.get(Router);
                //this.toastr.error(error.error.message);
                router.navigate(['error']);
              }
              if ((error.error.message as string).includes('ORA-12170')) {
                const router = this.injector.get(Router);
                //this.toastr.error(error.error.message);
                router.navigate(['error']);
              }
              break;
          }
        }
        return throwError(error);
      })
    );
  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {

    if (this.refreshTokenInProgress) {
      // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
      // – which means the new token is ready and we can retry the request again
      return this.refreshTokenSubject.pipe(
        filter(result => result !== null),
        take(1),
        switchMap(() => next.handle(this.addToken(request, this.auth.getToken()))));
    } else {
      this.refreshTokenInProgress = true;

      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);

      // Call auth.refreshAccessToken(this is an Observable that will be returned)
      return this.auth
        .refreshToken().pipe(
          switchMap((data: any) => {
            //When the call to refreshToken completes we reset the refreshTokenInProgress to false
            // for the next time the token needs to be refreshed
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(data.token);

            console.log('refresh token');
            return next.handle(this.addToken(request, data.token));
          }),
          catchError((err: any) => {
            this.refreshTokenInProgress = false;
            console.log('error refresh token');
            window.location.href = AppConstants.baseURL + '/loginSaml';

            return throwError(error);
          })
        );
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    token = this.auth.getToken();

    if (!token) {
      return request;
    }

    return request.clone({
      setHeaders: {
        Authorization: `bearer ${token}`
      }
    });
  }

}