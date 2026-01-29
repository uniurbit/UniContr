import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstants } from '../app-constants';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

    static readonly DEFAULT_ERROR_TITLE: string = 'Qualcosa è andato storto';

    constructor(private injector: Injector) {}

    handleError(error: any) {
     const router = this.injector.get(Router);
      if (error instanceof HttpErrorResponse) {
        // Backend returns unsuccessful response codes such as 404, 500 etc.
        console.error('Backend returned status code: ', error.status);
        console.error('Response body:', error.message);

        const httpErrorCode = error.error.httpErrorCode;
        switch (httpErrorCode) {
            case 401: // UNAUTHORIZED:
               //this.toastr.error('Richiesta autenticazione', 'Oops!');
                router.navigateByUrl(AppConstants.baseApiURL + '/loginSaml');
                break;
            case 403: // FORBIDDEN:
                // this.toastr.error('Richiesta non permessa', 'Oops!');
                //outer.navigateByUrl('/unauthorized');
                break;
            case 400: // BAD_REQUEST:
                // this.showError(error.message);
               //this.toastr.error('Richiesta errata', 'Oops!');
                break;
            case 500:
                if (error.error.message) {
                    //this.toastr.error(error.error.message);
                    // outer.navigateByUrl("/unauthorized");
                }
            default:
                // this.toastr.error(GlobalErrorHandlerService.DEFAULT_ERROR_TITLE, 'Oops!');
        }

      } else {
          // A client-side or network error occurred
          // console.error('An error occurred:', error.message);
          throw error;
      }
    }

}
