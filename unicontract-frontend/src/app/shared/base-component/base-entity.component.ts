import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { UntypedFormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceEntity } from '../query-builder/query-builder.interfaces';
import { Subject, Observable, Subscription } from 'rxjs';
import { InfraMessageType } from '../message/message';
import { filter } from 'rxjs/operators';
import {Location} from '@angular/common';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
    template: `NOT UI`,
    standalone: false
})

// ng g c submission/components/user -s true --spec false -t true

export class BaseEntityComponent implements OnInit, OnDestroy {

  @Input() idModal?: string;
  
  protected onDestroy$ = new Subject<void>();
  isLoading = true;

  form = new UntypedFormGroup({});

  model: any = {};

  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  protected fields: FormlyFieldConfig[];
  title = null;
  protected service: ServiceEntity;
  activeNew = false;
  researchPath: string = null;
  newPath: string = null;
  isRemovable = false;
  private sub: Subscription;
  returnUrl: string = null;
  locationBack: Boolean = true;
  public initObj: any = null;

  constructor(protected route: ActivatedRoute, protected router: Router, protected location: Location) {

  }


  ngOnInit() {
    this.isLoading = true;
    this.options.formState.isLoading = true;
    // se apro con i parametri returnUrl e initObj
    // nascondere pulsante nuovo e ricerca e all'aggiorna torna
    // indietro se salvataggio è andato a buon fine
    this.route.queryParams
      .subscribe(params => {
        if (params.returnUrl) {
          this.returnUrl = params.returnUrl;
        }
        if (params.initObj) {
          // setTimeout(()=> {
            this.model = JSON.parse(params.initObj);
            this.initObj = JSON.parse(params.initObj);
          // }, 0);
        }
    });

    this.sub = this.route.params.subscribe(params => {
      this.service.clearMessage();

      const id = params['id'] ?? this.idModal;

      // NB params['id'] ha valore new 
      if (id){        
        if (id=='new'){
          //se sono in nuovo il pulsante nuovo lo disattivo
          this.activeNew = false;
        }

        this.isLoading = true;
        this.options.formState.isLoading = true;
        //params['id'] contiene il parametro letto dalla url, può contenere un id o anche la parola new
        this.service.getById(id).subscribe({
          next: (data) => {    
            setTimeout(()=> {              
              if (this.initObj)
                this.model = { ...JSON.parse(JSON.stringify(data)), ...this.initObj};
              else {
                if (data){
                  this.model = JSON.parse(JSON.stringify(data));
                }                
              }              
                                
              //aggiornamento riferimento nel formstate
              this.options.formState.model = this.model;

              this.isLoading = false;
              this.options.formState.isLoading = false;
              this.postGetById();       
            });                                        
          },
          // complete: () => {
          //   this.isLoading = false;
          //   this.options.formState.isLoading = false;
          // }
        });
      }else{          
        this.additionalFormInitialize();             
        this.isLoading = false;
        this.options.formState.isLoading = false;
      }
      
    });    
  }  

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    if (this.sub)
      this.sub.unsubscribe();    
  }

  protected postGetById(){}// hook for child
  protected additionalFormInitialize() {}
  protected postOnSubmit() {}
  protected preOnSubmit() {}
  protected preUpdate(tosubmit) { return tosubmit };

  onNew(){    
    if (this.newPath){      
      //eliminare  oggetto di init      
      this.router.navigate([this.newPath]);                    
    }else{
      this.model = {};
      this.form.reset();
      this.service.clearMessage();
    }
    
  }

  public openConfirmationDialog() {
    
  }


  onRemove() {
    // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
    this.service.confirmationDialogService.confirm('Conferma', "Vuoi procedere con l'operazione di elminazione?" )
      .then((confirmed) => {
        if (confirmed) {
          this.remove();
        }
        // console.log(confirmed);
      })
      .catch(() => {
        this.isLoading = false;
      });
  }

  remove(){
    if (!this.model['id'])
      return;
    this.isLoading = true;
    this.service.remove(this.model['id']).subscribe(
      prop => {
        this.isLoading = false; 
        this.model = null;
        if (this.returnUrl)
          this.onBack();
        else
          this.onResearch(); //impostare come se fosse in nuovo
      },
      error => { // error path        
        console.log(error);
        this.isLoading = false; 
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.preOnSubmit();
      let tosubmit = { ...this.model, ...this.form.value };      
      this.preUpdate(tosubmit);
      this.service.update(tosubmit, tosubmit.id ? tosubmit.id : null , true).subscribe(
        result => {
          
          this.isLoading = false;          
          this.router.navigate([this.researchPath, result.id]);
          
          this.model = JSON.parse(JSON.stringify(result));
          this.options.resetModel(result);
          this.options.updateInitialValue();
          this.postOnSubmit();

          if (!this.activeNew && this.returnUrl){
            this.onBack();
          }

        },
        error => {
          this.isLoading = false;
          //this.service.messageService.error(error);          
        });
    }
  }

  onReload() {
    if (this.model['id']) {
      this.options.resetModel(); 
      this.form.markAsPristine();     
    }
  }

  get isReloadable() {
    if (this.model == null)
      return false;

    return this.model['id'] != null;
  }

  onResearch(){  
    if (this.researchPath){
      this.router.navigate([this.researchPath]);    
    }
  }

  onBack(){
    if (this.returnUrl){
      this.router.navigate([this.returnUrl]);
    } else {
      this.goBack();
    }
  }

  goBack(): void {
    this.location.back();
  }

  public onValidate() {
    const invalid = [];
    const controls = this.form.controls;
    this.service.clearMessage();
    for (const name in controls) {        
        if (controls[name].invalid) {
            for (const error in controls[name].errors){
              this.service.messageService.add(InfraMessageType.Error, name + " " + error, false);
              invalid.push(name +" " + controls[name].getError(error));
            }          
        }
    }
    //console.log(invalid);    
  }

}
