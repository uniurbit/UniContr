import { Component, OnInit, OnDestroy } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { distinctUntilChanged, takeUntil, filter, tap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Component({
    selector: 'app-select-type',
    template: `  
  `,
    styles: [],
    standalone: false
})
export class SelectTypeComponent extends FieldType implements OnInit, OnDestroy {
  
  constructor(){
    super()
  }

  onDestroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  } 

  ngOnInit(): void {
   
  }
  
  onPopulate(field: FormlyFieldConfig) {
    if (field.type == 'select') {
      return;
    }

    field.type = 'select';     
    field.wrappers = ['form-field'];       
    field.hooks = {
      onInit: (field) => {
        field.formControl.valueChanges.pipe(
          distinctUntilChanged(),
          takeUntil(this.onDestroy$),
          filter(() => field.options.formState.isLoading && (field.props.options as Array<any>).length == 0),
          tap(cod => {                        
            field.props.options = [field.props.inizialization()];                      
          })
        ).subscribe();
        
        (field.props.populateAsync() as Observable<any[]>).subscribe((data) => {
          field.props.options = data;
        });
      }
    };
  }

}
