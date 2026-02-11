import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { RequestCacheWithMap } from './request-cache.service';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    AuthService,
    RequestCacheWithMap,
  ]
})

export class CoreModule { }
