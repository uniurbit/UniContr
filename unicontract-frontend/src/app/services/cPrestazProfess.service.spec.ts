import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CPrestazProfessService } from './cPrestazProfess.service';
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

describe('CPrestazProfessService', () => {
  let service: CPrestazProfessService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [ provideHttpClient(),
        provideHttpClientTesting(),CPrestazProfessService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(CPrestazProfessService);
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

  it('should call API in getPrestazProfess()', () => {
    (service as any).getPrestazProfess('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/details/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in newPrestazProfess()', () => {
    (service as any).newPrestazProfess('x').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call API in updatePrestazProfess()', () => {
    (service as any).updatePrestazProfess('x', '1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});