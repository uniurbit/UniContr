import { NgbDateStruct, NgbDateAdapter } from "@ng-bootstrap/ng-bootstrap";
import { Injectable } from "@angular/core";
import { toInteger, isNumber } from "./shared/dynamic-form/utils";


@Injectable()
export class NgbStringAdapter extends NgbDateAdapter<string> {

  fromModel(date: string): NgbDateStruct {

    if (date) {
        date = date.split('/').join('-');
        const dateParts = date.trim().split('-');
        if (dateParts.length === 1 && isNumber(dateParts[0])) {
            return {day: toInteger(dateParts[0]), month: null, year: null};
        } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
            return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: null};
        } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
            return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2])};
        }  
    }
    return null;        
  }

  toModel(date: NgbDateStruct): string {
    return date ? String('00' + date.day).slice(-2) + '-' + String('00' + date.month).slice(-2)
                            + '-' + date.year.toString() : null;
  }
}