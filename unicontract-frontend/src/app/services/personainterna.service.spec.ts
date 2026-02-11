import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PersonaInternaService } from './personainterna.service';
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

describe('PersonaInternaService', () => {
  let service: PersonaInternaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [  provideHttpClient(),
        provideHttpClientTesting(),PersonaInternaService, { provide: MessageService, useClass: MockMessageService }, { provide: ConfirmationDialogService, useClass: MockConfirmationDialogService }]
    });
    service = TestBed.inject(PersonaInternaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });
});