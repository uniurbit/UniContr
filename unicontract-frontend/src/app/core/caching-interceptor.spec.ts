import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CachingInterceptor } from './caching-interceptor';
import { MessageCacheService } from './message.service';
import { RequestCache, RequestCacheWithMap } from './request-cache.service';


/**
 * Verifica comportamento base:
 * - prima GET va in rete e viene cachata
 * - seconda GET identica viene servita da cache (nessuna seconda request)
 *
 * Adatta se l'interceptor cache solo alcune URL o usa header di controllo.
 */
describe('CachingInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  const messengerMock = {
    add: jasmine.createSpy('add'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({      
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: MessageCacheService, useValue: messengerMock },
        { provide: RequestCache, useClass: RequestCacheWithMap },    
        { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    
    messengerMock.add.calls.reset();
  });

  afterEach(() => httpMock.verify());

 
  it('should cache GET responses and reuse them (no second network call)', () => {
    // 1) Prima chiamata -> network
    let firstBody: any;
    http.get('/api/cache-me').subscribe((b) => (firstBody = b));

    const req1 = httpMock.expectOne('/api/cache-me');
    req1.flush({ value: 1 });

    // 2) Seconda chiamata -> cache (nessun network)
    let secondBody: any;
    http.get('/api/cache-me').subscribe((b) => (secondBody = b));

    httpMock.expectNone('/api/cache-me');

    expect(firstBody).toEqual({ value: 1 });
    expect(secondBody).toEqual({ value: 1 });
  });

  it('should refresh when x-refresh header is present (emit cached then fresh)', () => {
    const results: any[] = [];

    // Warm cache
    http.get('/api/cache-me').subscribe();
    const warm = httpMock.expectOne('/api/cache-me');
    warm.flush({ value: 'cached' });

    // Cache-then-refresh
    http.get('/api/cache-me', { headers: { 'x-refresh': 'true' } })
      .subscribe((b) => results.push(b));

    // Deve partire una richiesta network per il refresh
    const refreshReq = httpMock.expectOne('/api/cache-me');
    refreshReq.flush({ value: 'fresh' });

    expect(results).toEqual([{ value: 'cached' }, { value: 'fresh' }]);
  });
});

