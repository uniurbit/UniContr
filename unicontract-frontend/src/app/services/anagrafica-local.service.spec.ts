import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AnagraficaLocalService } from './anagrafica-local.service';
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

describe('AnagraficaLocalService', () => {
  let service: AnagraficaLocalService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({
  
      providers: [  provideHttpClient(),
        provideHttpClientTesting(),AnagraficaLocalService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(AnagraficaLocalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getAnagraficaLocal()', () => {
    (service as any).getAnagraficaLocal('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/local/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in newAnagraficaLocal()', () => {
    (service as any).newAnagraficaLocal({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in updateAnagraficaLocal()', () => {
    (service as any).updateAnagraficaLocal({}, '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in download', () => {
    (service as any).download('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/attachments/download/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in deleteFile()', () => {
    (service as any).deleteFile('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'DELETE' && (r.url.includes('/attachments/'));
    });
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});