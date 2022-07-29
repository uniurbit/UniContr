import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd } from '@angular/router';
import { AuthService } from '../core';
import { AppConstants } from 'src/app/app-constants';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  sidebarCollapsed = true;
  _baseURL: string;

  onDestroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {

    this._baseURL = AppConstants.baseApiURL;
    let token = null;

    router.events.pipe(takeUntil(this.onDestroy$)).subscribe(s => {
      if (s instanceof NavigationEnd) {
        let params: URLSearchParams;
        if (s.url.includes('/home')) {
          params = new URLSearchParams(s.url.split('/home')[1]);
        } else {
          params = new URLSearchParams(s.url.split('/')[1]);
        }

        token = params.get('token');

        alert(token);
        if (token) {
            console.log('keep token home component');
            authService.loginWithToken(token);
            const redirect = params.get('redirect');          
            authService.redirectFirstLogin(redirect);
          } else {
            console.log('no token home component');
          }
      }
    });

   }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  btnClick = function () {
        // this.router.navigateByUrl('/user');
        window.location.replace(this._baseURL + 'loginSaml');
  };

}

