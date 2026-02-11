export * from './core.module';
export * from './auth.service';
export * from './auth.guard';
export * from './base-entity';
export * from './form-state';
export * from './request-cache.service';
export * from './message.service';


import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { CachingInterceptor } from './caching-interceptor';
import { from } from 'rxjs';
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandlerService } from './global-error-handler.service';

/** Http interceptor providers in outside-in order */
export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptor, multi: true },
  ];

export const GlobalErrorHandlerProviders = [
  GlobalErrorHandlerService,
  { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
];
