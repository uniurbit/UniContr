import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { MessageService } from '../shared/message.service';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { provideHttpClient } from '@angular/common/http';



class MockMessageService {
  info() {}
  error() {}
  clear() {}
}

class MockConfirmationDialogService {
  confirm() { return Promise.resolve(true); }
}

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [provideHttpClient(), provideHttpClientTesting(),UserService, { provide: MessageService, useClass: MockMessageService }, { provide: ConfirmationDialogService, useClass: MockConfirmationDialogService }]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getUsers()', () => {
    (service as any).getUsers({}).subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/users'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getRoles()', () => {
    (service as any).getRoles().subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/users/roles'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in getPermissions()', () => {
    (service as any).getPermissions().subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/users/permissions'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });
});