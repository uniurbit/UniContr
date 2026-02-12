import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

/**
 * NOTE:
 * - Adatta i metodi del mock AuthService ai nomi reali (es. isAuthenticated(), isLoggedIn(), hasToken(), ecc.)
 * - Se il guard ritorna UrlTree invece di boolean, le expect vanno aggiornate.
 */
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: Router;
  const loggedInSubject = new BehaviorSubject<boolean>(false);
  const authServiceMock = {
    // TODO: rinomina in base al tuo AuthService
    isAuthenticated: jasmine.createSpy('isAuthenticated'),
    isLoggedIn: loggedInSubject.asObservable(),
    setLoggedIn(value: boolean) {
      loggedInSubject.next(value);
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // <- no params
        provideHttpClientTesting(),
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });


  it('should allow navigation when user is authenticated', async () => {
    authServiceMock.setLoggedIn(true);
    authServiceMock.isAuthenticated.and.returnValue(true);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

    const result = await firstValueFrom(
      guard.canActivate(route, state) as any // Observable<boolean>
    );

    expect(result as any).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should block navigation and redirect when user is not authenticated', async () => {
    authServiceMock.setLoggedIn(false);
    authServiceMock.isAuthenticated.and.returnValue(false);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/test' } as RouterStateSnapshot;

   const result = await firstValueFrom(
      guard.canActivate(route, state) as Observable<boolean>
    );

    expect(result).toBeFalse();

  });
});


