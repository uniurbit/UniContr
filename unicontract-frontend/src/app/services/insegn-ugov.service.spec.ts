import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { InsegnUgovService } from './insegn-ugov.service';
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

describe('InsegnUgovService', () => {
  let service: InsegnUgovService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),InsegnUgovService, { provide: MessageService, useClass: MockMessageService }
      ],

    });
    service = TestBed.inject(InsegnUgovService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getListaInsegnamentiUgov()', () => {
    (service as any).getListaInsegnamentiUgov('2024').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/anno/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getInsegnamentoUgov()', () => {
    (service as any).getInsegnamentoUgov('1', '2024').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getRefreshUgovData()', () => {
    (service as any).getRefreshUgovData('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/reload/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in query()', () => {
    (service as any).query({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/query'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });
});