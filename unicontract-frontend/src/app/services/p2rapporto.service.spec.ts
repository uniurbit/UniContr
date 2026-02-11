import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { P2rapportoService } from './p2rapporto.service';
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

describe('P2rapportoService', () => {
  let service: P2rapportoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({      
      providers: [  provideHttpClient(),
        provideHttpClientTesting(), P2rapportoService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(P2rapportoService);
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
});