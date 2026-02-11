import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BreadcrumbService } from './breadcrumb.service';
import { provideHttpClient } from '@angular/common/http';


describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [  provideHttpClient(),
        provideHttpClientTesting(),BreadcrumbService]
    });
    service = TestBed.inject(BreadcrumbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });
});