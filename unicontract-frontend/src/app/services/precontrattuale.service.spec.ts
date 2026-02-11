import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PrecontrattualeService } from './precontrattuale.service';
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

describe('PrecontrattualeService', () => {
  let service: PrecontrattualeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({      
      providers: [  provideHttpClient(),
        provideHttpClientTesting(),PrecontrattualeService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(PrecontrattualeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in newPrecontr()', () => {
    (service as any).newPrecontr('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in getPrecontr()', () => {
    (service as any).getPrecontr('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in updatePrecontr()', () => {
    (service as any).updatePrecontr('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should call API in newPrecontrImportInsegnamento()', () => {
    (service as any).newPrecontrImportInsegnamento('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/newprecontrimportinsegnamento'));
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in newIncompat()', () => {
    (service as any).newIncompat('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/newincompat'));
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in newPrivacy()', () => {
    (service as any).newPrivacy('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/newprivacy'));
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in newInps()', () => {
    (service as any).newInps('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/newinps'));
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in newPrestazProfess()', () => {
    (service as any).newPrestazProfess('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/newprestazprofess'));
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in terminaInoltra()', () => {
    (service as any).terminaInoltra({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/terminainoltra'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in getTitulusDocumentURL()', () => {
    (service as any).getTitulusDocumentURL('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/gettitulusdocumenturl/'));
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

  it('should call API in getById()', () => {
    (service as any).getById('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in downloadcontrattofirmato()', () => {
    (service as any).downloadContrattoFirmato('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/downloadcontrattofirmato/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});