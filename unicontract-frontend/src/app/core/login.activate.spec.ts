import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginActivate } from './login.activate';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

/**
 * LoginActivate tipicamente:
 * - consente accesso alla pagina login SOLO se NON autenticato
 * - se autenticato, redirige a /home (o rotta principale)
 *
 * Adatta path e metodi reali.
 */
describe('LoginActivate', () => {
  let guard: LoginActivate;
  let router: Router;

  const authServiceMock = {
    isAuthenticated: jasmine.createSpy('isAuthenticated'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({      
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LoginActivate,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    guard = TestBed.inject(LoginActivate);
    router = TestBed.inject(Router);
    
  });

  it('should allow navigation to login when user is NOT authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);
    spyOn(router, 'navigate');
    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state) as any 

    expect(result as any).toBeTrue();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should redirect away from login when user IS authenticated',  () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

    const result = guard.canActivate(route, state) as any 

    expect(result as any).toBeTrue();
  });
});
