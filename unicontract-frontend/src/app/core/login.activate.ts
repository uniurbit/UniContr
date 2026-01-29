import { Injectable } from '@angular/core';
// import { CanActivate } from '@angular/router/src/utils/preactivation';
import { AuthService } from '.';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoginActivate  {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    if (!this.authService.isAuthenticated()) {            
      if (state.url){
        this.router.navigate(['externallogin'], { queryParams: { redirect: state.url } });      
      }else{
        this.router.navigate(['externallogin']);      
      }
      
    }
    return true;
  }
}
