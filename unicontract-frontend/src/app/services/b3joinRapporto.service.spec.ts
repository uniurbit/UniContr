import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { B3JoinRapportoService } from './b3joinRapporto.service';
import { MessageService } from '../shared/message.service';
import { provideHttpClient } from '@angular/common/http';



class MockMessageService {
  info() {}
  error() {}
  clear() {}
}

class MockConfirmationDialogService {
  confirm() { return Promise.resolve(true); }
}

describe('B3JoinRapportoService', () => {
  let service: B3JoinRapportoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [ provideHttpClient(),
        provideHttpClientTesting(),B3JoinRapportoService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(B3JoinRapportoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in newRapporto()', () => {
    (service as any).newRapporto({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in getRapporto()', () => {
    (service as any).getRapporto('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/details/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in listaRapporti()', () => {
    (service as any).listaRapporti('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in updateRapporto()', () => {
    (service as any).updateRapporto({}, '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in deleteRapporto()', () => {
    (service as any).deleteRapporto('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});