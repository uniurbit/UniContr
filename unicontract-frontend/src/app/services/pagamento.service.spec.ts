import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PagamentoService } from './pagamento.service';
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

describe('PagamentoService', () => {
  let service: PagamentoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [ provideHttpClient(),
        provideHttpClientTesting(),PagamentoService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(PagamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getPagamento()', () => {
    (service as any).getPagamento('1', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getPagamentoLocal()', () => {
    (service as any).getPagamentoLocal('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/local/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in newPagamento()', () => {
    (service as any).newPagamento('2024').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in updatePagamentoLocal()', () => {
    (service as any).updatePagamentoLocal('2024', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/local/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});