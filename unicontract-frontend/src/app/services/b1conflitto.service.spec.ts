import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { B1ConflittoService } from './b1conflitto.service';
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

describe('B1ConflittoService', () => {
  let service: B1ConflittoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [  provideHttpClient(),
        provideHttpClientTesting(),B1ConflittoService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(B1ConflittoService);
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

  it('should call API in newConflitto()', () => {
    (service as any).newConflitto('2024').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in getConflitto()', () => {
    (service as any).getConflitto('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/details/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in updateConflitto()', () => {
    (service as any).updateConflitto('2024', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call API in generatePdf()', () => {
    (service as any).generatePdf('1', 'test').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/generatepdf/') && r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});