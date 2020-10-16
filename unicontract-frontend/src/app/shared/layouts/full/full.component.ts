import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AuthService } from 'src/app/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants } from 'src/app/app-constants';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, OnDestroy {
  public config: PerfectScrollbarConfigInterface = {};
  onDestroy$ = new Subject<void>();

  constructor(private authService: AuthService, public router: Router) {

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
        if (token) {
            console.log('keep token');
            authService.loginWithToken(token);
            authService.redirectFirstLogin();
          } else {
            console.log('no token');
          }
      }
    });

   }

  tabStatus = 'justified';

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;
  public expandLogo = false;

  options = {
    theme: 'light', // two possible values: light, dark
    dir: 'ltr', // two possible values: ltr, rtl
    layout: 'vertical', // fixed value. shouldn't be changed.
    sidebartype: 'full', // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarpos: 'fixed', // two possible values: fixed, absolute
    headerpos: 'fixed', // two possible values: fixed, absolute
    boxed: 'full', // two possible values: full, boxed
    navbarbg: 'skin6', // six possible values: skin(1/2/3/4/5/6)
    sidebarbg: 'skin5', // six possible values: skin(1/2/3/4/5/6)
    logobg: 'skin6' // six possible values: skin(1/2/3/4/5/6)
  };

  Logo() {
    this.expandLogo = !this.expandLogo;
  }

  ngOnInit() {
    if (this.router.url === '/') {      
      if (this.authService.isAuthenticated()){
        this.authService.redirectFirstLogin();
      }else{
        this.router.navigate(['home/']);
      }      
    }
    this.defaultSidebar = this.options.sidebartype;
    this.handleSidebar();
    

  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleSidebar();
  }

  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
      case 'iconbar':
        if (this.innerWidth < 1170) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case 'overlay':
        if (this.innerWidth < 767) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case 'full':
      case 'iconbar':
        this.options.sidebartype = 'mini-sidebar';
        break;

      case 'overlay':
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          this.options.sidebartype = 'full';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  get documentationUrl() {
    return AppConstants.documentationURL;
  }

  isDebug() {
    return !environment.production
  }
}
