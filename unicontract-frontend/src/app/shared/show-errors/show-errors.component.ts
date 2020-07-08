import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';
/* Componenete per la visualizzazione degli errori  */
@Component({
  selector: 'app-show-errors',
  template: `
  <div *ngIf="shouldShowErrors()">
    <span class="small form-text text-danger" *ngFor="let error of listOfErrors()">{{error}}</span>
  </div>
  `,
})
export class ShowErrorsComponent implements OnInit {

  private static readonly errorMessages = {
    'required': () => 'Campo richiesto',
    'minlength': (params) => 'Numero minimo di caratteri è ' + params.requiredLength,
    'maxlength': (params) => 'Numero massimo di caratteri ammessi è ' + params.requiredLength,
    'pattern': (params) => 'Il formato richiesto è ' + params.requiredPattern,
    'years': (params) => params.message,
    'countryCity': (params) => params.message,
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message
  };

  @Input()
  public control: AbstractControlDirective | AbstractControl;
 
  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }
 
  private getMessage(type: string, params: any) {
    if (Object.keys(ShowErrorsComponent.errorMessages).includes(type))
      return ShowErrorsComponent.errorMessages[type](params);
    else{
      console.log(type);
    }
  } 

  constructor() { }

  ngOnInit() {
  }

}
