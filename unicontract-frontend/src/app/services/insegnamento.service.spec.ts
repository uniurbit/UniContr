import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { InsegnamentoService } from './insegnamento.service';
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

describe('InsegnamentoService', () => {
  let service: InsegnamentoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [   provideHttpClient(),
        provideHttpClientTesting(),InsegnamentoService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(InsegnamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getListaInsegnamenti()', () => {
    (service as any).getListaInsegnamenti().subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (true);
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getInsegnamento()', () => {
    (service as any).getInsegnamento('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in check()', () => {
    (service as any).check('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/check/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in updateInsegn()', () => {
    (service as any).updateInsegn({}, '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/upd/'));
    });
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in updateInsegnamentoFromUgov()', () => {
    (service as any).updateInsegnamentoFromUgov({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/updateinsegnamentofromugov'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in changeCoperturaFromUgov()', () => {
    (service as any).changeCoperturaFromUgov({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/changecoperturafromugov'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in changeContatoreInsegnamentiManuale()', () => {
    (service as any).changeContatoreInsegnamentiManuale({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/changecontatoreinsegnamentimanuale'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in changeRinnovo()', () => {
    (service as any).changeRinnovo({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (r.url.includes('/precontrattuale/changerinnovo'));
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in newInsegn()', () => {
    (service as any).newInsegn({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('should call API in sendFirstEmail()', () => {
    (service as any).sendFirstEmail('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/sendfirstemail/'));
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