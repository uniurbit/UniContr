import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { RuoloDocenteService } from './ruoloDocente.service';
import { provideHttpClient } from '@angular/common/http';


describe('RuoloDocenteService', () => {
  let service: RuoloDocenteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [ provideHttpClient(),
        provideHttpClientTesting(),RuoloDocenteService]
    });
    service = TestBed.inject(RuoloDocenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in nuovoRuoloDocente()', () => {
    (service as any).nuovoRuoloDocente({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });
});