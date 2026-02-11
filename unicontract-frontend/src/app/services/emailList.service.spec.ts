import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EmailListService } from './emailList.service';
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

describe('EmailListService', () => {
  let service: EmailListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),EmailListService, { provide: MessageService, useClass: MockMessageService }
      ],

    });
    service = TestBed.inject(EmailListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getEmailList()', () => {
    (service as any).getEmailList('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/') && r.url.includes('/maillist/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in storeEmailInfo()', () => {
    (service as any).storeEmailInfo({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });
});