import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core';
import { Router } from '@angular/router';
import { AppConstants } from 'src/app/app-constants';
declare var $: any;

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    standalone: false
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public showSearch = false;

  
  isLoggedIn$: Observable<boolean>;  
  
  baseurl = environment.API_URL;

  constructor(private modalService: NgbModal, public authService: AuthService, private router: Router) {} 

  ngAfterViewInit() {}

  goHome() {
    //this.router.navigate(['']); 
  }

  goSearch() {
    //this.router.navigate(['search']); 
  }
  
  goLogin(){
    if (!this.authService.isLoggedIn){
      this.authService.login();
    }
  }  

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn; // {2}
  }

  onLogout(){
    this.authService.logout(); 
    this.router.navigate(['home']);                     // {3}
  }

  get username(){
    return this.authService.username;
  }

  get email(){
    return this.authService.email;
  }

  get documentationUrl(){
    return AppConstants.documentationURL;
  }
}

