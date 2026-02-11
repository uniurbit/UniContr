import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, NavigationCancel, Router } from '@angular/router';
import { AuthService } from './core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent {
  title = 'UniContract-FrontEnd';
  errorMessage = '';

  constructor(public router: Router, private authService: AuthService, private rolesService: NgxRolesService,private route: ActivatedRoute) {
    console.log('constructor app-root ');      
  }

  ngOnInit() {
    console.log('init app-root');

    this.route.queryParams.subscribe(params => {
      //arriva un primo evento / e empty params is inizialization
      if (params && params['token']) {
        const token = params['token']; 
        // Check if localStorage is available e passo il token per eventuale messaggio di errore
        if (!this.authService.isLocalStorageAvailable(true, token)) {
          console.warn('LocalStorage is not available, redirecting...');
          this.router.navigate(['enable-local-storage']); // Redirect if localStorage is unavailable
        } else {
          // If localStorage is available, proceed to login with the token if available
          //if (token) {
          //  console.log('Token found, logging in...');
          //  this.authService.loginWithToken(token); // Log the user in using the token
          //}         
        }
      }
    });

    if (!this.authService.isLocalStorageAvailable(true)) {
      this.router.navigate(['enable-local-storage']);
    }
    
    // Reload the authentication logic
    this.authService.reload();
  }

}

