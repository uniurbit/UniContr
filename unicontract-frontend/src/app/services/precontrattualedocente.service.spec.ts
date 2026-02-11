import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PrecontrattualeDocenteService } from './precontrattualedocente.service';
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

const dummyBlob = new Blob(['Test content'], { type: 'application/vnd.ms-excel' });

describe('PrecontrattualeDocenteService', () => {
  let service: PrecontrattualeDocenteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [ provideHttpClient(),
        provideHttpClientTesting(),PrecontrattualeDocenteService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(PrecontrattualeDocenteService);
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

  it('should call API in getTitulusDocumentURL()', () => {
    (service as any).getTitulusDocumentURL('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/precontrattuale') && r.url.includes('/gettitulusdocumenturl/'));
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

  it('should call API in export()', () => {
    (service as any).export({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/export'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in exportxls()', () => {
    (service as any).exportxls({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(dummyBlob);
  });

  it('should call API in if()', () => {
    (service as any).downloadContrattoFirmato('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/precontrattuale') && r.url.includes('/downloadcontrattofirmato/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});