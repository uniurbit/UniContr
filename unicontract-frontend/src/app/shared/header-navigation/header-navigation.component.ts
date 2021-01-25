import { Component, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import {
  NgbModal,
  ModalDismissReasons,
  NgbPanelChangeEvent,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/services/settings.service';

declare var $: any;

@Component({
  selector: 'app-header-navigation',
  templateUrl: './header-navigation.component.html'
})

export class HeaderNavigationComponent implements AfterViewInit {

  @Input() options;
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;

  isLoggedIn$: Observable<boolean>;

  baseurl = environment.API_URL;

  constructor(private modalService: NgbModal, public authService: AuthService, private router: Router, public settingService: SettingsService) {}

  ngAfterViewInit() {}

  goHome() {
    // this.router.navigate(['']);
  }

  goSearch() {
    // this.router.navigate(['search']);
  }

  goLogin() {
    if (!this.authService.isLoggedIn) {
      this.authService.login();
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['home']);
  }

  get username() {
    return this.authService.username;
  }

  get email() {
    return this.authService.email;
  }

  //theme: 'light', // two possible values: light, dark
  themeNormal(){
    this.options.theme = 'light';
    this.settingService.setSetting('THEME','light');
  }

  themeDark(){
    this.options.theme = 'dark';
    this.settingService.setSetting('THEME','dark');
  }

}
