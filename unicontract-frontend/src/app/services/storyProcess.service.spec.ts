import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StoryProcessService } from './storyProcess.service';
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

describe('StoryProcessService', () => {
  let service: StoryProcessService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
        TestBed.configureTestingModule({

      providers: [provideHttpClient(), provideHttpClientTesting(),StoryProcessService, { provide: MessageService, useClass: MockMessageService }]
    });
    service = TestBed.inject(StoryProcessService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should call API in getStory()', () => {
    (service as any).getStory('1').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'GET' && (r.url.includes('/'));
    });
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should call API in newStory()', () => {
    (service as any).newStory('2024').subscribe(() => {});

    const req = httpMock.expectOne(r => {
      return r.method === 'POST' && (true);
    });
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});