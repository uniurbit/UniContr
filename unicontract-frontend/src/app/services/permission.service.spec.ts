import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PermissionService } from './permission.service';
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

describe('PermissionService', () => {
  let service: PermissionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [  provideHttpClient(),
        provideHttpClientTesting(),PermissionService, { provide: MessageService, useClass: MockMessageService }, { provide: ConfirmationDialogService, useClass: MockConfirmationDialogService }]
    });
    service = TestBed.inject(PermissionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });
});