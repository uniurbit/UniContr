import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValidazioneService } from './validazione.service';
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

describe('ValidazioneService', () => {
  let service: ValidazioneService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [   provideHttpClient(),
        provideHttpClientTesting(),ValidazioneService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(ValidazioneService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in updateValidation()', () => {
    (service as any).updateValidation('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'PUT' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });
});