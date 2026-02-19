import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TokenInterceptor } from './token.interceptor';
import { AuthService } from './auth.service';

/**
 * Verifica che l'interceptor aggiunga Authorization: Bearer <token>
 * - adatta la chiave/metodo con cui recuperi il token (getToken(), token, ecc.)
 * - se l'interceptor esclude alcune URL, aggiungi un test dedicato.
 */
describe('TokenInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceMock: { getToken: jasmine.Spy };

  beforeEach(() => {
    authServiceMock = {
      getToken: jasmine.createSpy('getToken').and.returnValue('TEST_JWT'),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()), // <- no params
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceMock },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should append Authorization header when token is present', () => {
    http.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');    
    expect(req.request.headers.get('Authorization')).toBe('Bearer TEST_JWT');

    req.flush({ ok: true });
  });

  it('should not append Authorization header when token is missing', () => {
    authServiceMock.getToken.and.returnValue(null);

    http.get('/api/test2').subscribe();

    const req = httpMock.expectOne('/api/test2');
    expect(req.request.headers.has('Authorization')).toBeFalse();

    req.flush({ ok: true });
  });
});
