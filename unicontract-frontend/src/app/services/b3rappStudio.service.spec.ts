import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { B3RappStudioUnivService } from './b3rappStudio.service';
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

describe('B3RappStudioUnivService', () => {
  let service: B3RappStudioUnivService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [        provideHttpClient(),
        provideHttpClientTesting(),B3RappStudioUnivService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(B3RappStudioUnivService);
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

  it('should call API in newRappStudio()', () => {
    (service as any).newRappStudio('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in getRappStudio()', () => {
    (service as any).getRappStudio('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/details/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in updateRappStudio()', () => {
    (service as any).updateRappStudio('x', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});