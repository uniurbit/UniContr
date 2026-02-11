import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DocenteService } from './docente.service';
import { provideHttpClient } from '@angular/common/http';


describe('DocenteService', () => {
  let service: DocenteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),DocenteService
      ],

    });
    service = TestBed.inject(DocenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in nuovoDocente()', () => {
    (service as any).nuovoDocente({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in getDocente()', () => {
    (service as any).getDocente('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});