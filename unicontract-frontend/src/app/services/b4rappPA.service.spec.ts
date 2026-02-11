import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { B4RappPAService } from './b4rappPA.service';
import { MessageService } from '../shared/message.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


class MockMessageService {
  info() {}
  error() {}
  clear() {}
}

class MockConfirmationDialogService {
  confirm() { return Promise.resolve(true); }
}

describe('B4RappPAService', () => {
  let service: B4RappPAService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [   provideHttpClient(),
        provideHttpClientTesting(),B4RappPAService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(B4RappPAService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getPrecontr()', () => {
    (service as any).getPrecontr('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in newRappPA()', () => {
    (service as any).newRappPA('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in getRappPA()', () => {
    (service as any).getRappPA('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/details/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in updateRappPA()', () => {
    (service as any).updateRappPA('x', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call API in if()', () => {
    (service as any).download('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/attachments/download/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});