import { Pipe, PipeTransform } from "@angular/core";
import {TranslateService} from '@ngx-translate/core';

@Pipe({
    name: 'mytranslate',
    pure: false,
  })
  export class MyTranslatePipe implements PipeTransform {
    constructor(private translateService: TranslateService) {}
  
    transform(value: any, args?: any): any {
      if (value){
        return this.translateService.instant(value);
      }
      return value;
    }
  }