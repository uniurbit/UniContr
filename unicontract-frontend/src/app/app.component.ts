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
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'UniContract-FrontEnd';
  errorMessage = '';

  constructor(public router: Router, private authService: AuthService, private rolesService: NgxRolesService) {
    console.log('constructor app-root ');
    let token = null;

    authService.reload();
  }

  ngOnInit() {
    console.log('init app-root');
  }

}

