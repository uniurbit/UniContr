import { Pipe, PipeTransform } from "@angular/core";
import {TranslateService} from '@ngx-translate/core';
import ControlUtils from "../dynamic-form/control-utils";
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'mydiffdate',   
  })
 
export class MyDiffdatePipe implements PipeTransform  {
  
  
  public transform(value): number {    
    //format yyyy-mm-aa
    const dateFrom = new Date(value);
    const dateTo = new Date();
    if (dateFrom && dateTo){
      const diff = dateTo.valueOf() - dateFrom.valueOf();
      const diffDays = Math.floor(diff / (1000 * 3600 * 24));
      if (Number.isInteger(diffDays)){
        return diffDays + 1;
      }       
    }
  }
}
