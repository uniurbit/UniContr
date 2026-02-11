import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SessionStorageService } from './session-storage.service';
import { provideHttpClient } from '@angular/common/http';


describe('SessionStorageService', () => {
  let service: SessionStorageService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [provideHttpClient(), provideHttpClientTesting(),SessionStorageService]
    });
    service = TestBed.inject(SessionStorageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });
});