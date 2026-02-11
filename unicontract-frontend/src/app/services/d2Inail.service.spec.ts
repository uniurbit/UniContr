import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { D2InailService } from './d2Inail.service';
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

describe('D2InailService', () => {
  let service: D2InailService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),D2InailService, { provide: MessageService, useClass: MockMessageService }
      ],      
    });
    service = TestBed.inject(D2InailService);
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

  it('should call API in getInail()', () => {
    (service as any).getInail('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/details/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in newInail()', () => {
    (service as any).newInail('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in updateInail()', () => {
    (service as any).updateInail('x', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});