import { TestBed } from '@angular/core/testing';
import { ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { AppConstants } from '../app-constants';

describe('GlobalErrorHandlerService', () => {
  let handler: ErrorHandler;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
      ],
    });

    handler = TestBed.inject(ErrorHandler);
  });

  it('should redirect to loginSaml when HttpErrorResponse has httpErrorCode=401', () => {
    const err = new HttpErrorResponse({
      status: 401,
      url: '/api/anything',
      error: { httpErrorCode: 401, message: 'Unauthorized' },
    });

    // Act
    handler.handleError(err);

    // Assert
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
      AppConstants.baseApiURL + '/loginSaml'
    );
  });

  it('should NOT redirect when HttpErrorResponse has httpErrorCode=403', () => {
    const err = new HttpErrorResponse({
      status: 403,
      url: '/api/anything',
      error: { httpErrorCode: 403, message: 'Forbidden' },
    });

    handler.handleError(err);

    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should rethrow non-HttpErrorResponse errors', () => {
    expect(() => handler.handleError(new Error('boom'))).toThrow();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });
});
