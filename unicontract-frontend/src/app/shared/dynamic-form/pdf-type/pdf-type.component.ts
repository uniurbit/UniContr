import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ng g c shared/dynamic-form/pdf-type -s true --spec false -t true

@Component({
  selector: 'app-pdf-type',
  templateUrl: './pdf-type.component.html',
  styles: []
})
export class PdfTypeComponent extends FieldType implements OnInit, OnDestroy {
  
  page: number = 1;
  totalPages: number;  
  zoom = 1.0;
  originalSize: boolean = true;
  isLoadedPdf: boolean = undefined;
  pdfSrc: ArrayBuffer;  
  onDestroy$ = new Subject<void>();

  //@ViewChild('filePdfInput') public filePdfInput: ElementRef;

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  ngOnInit() { 
    
    this.field.formControl.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((value )=>{
        if (value){          
          this.isLoadedPdf=true;
          this.pdfSrc = decode(value);
        }else{
          this.isLoadedPdf= false;
          this.pdfSrc = null;
        }
    });

    //todo agganciare i valori al formcontrol per evitare il ricaricamento
    if (this.field.formControl.value){      
      this.pdfSrc = decode(this.field.formControl.value);
      this.isLoadedPdf=true;
    }
    
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoadedPdf = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  incrementZoom(amount: number) {
    let tmp = this.zoom + amount;
    if ( tmp > 0.11 && tmp< 2.9){
      this.zoom += amount;
    }
  }

  onFileChanged(event) {    
    let selFile = event.target.files[0] as File;
    if (selFile){
      //this.filename = selFile.name;      
      //load pdf 
      const reader = new FileReader();
      reader.onload = (e: any) => {    
        this.field.formControl.setValue(encode(e.target.result));
        this.pdfSrc = e.target.result
        this.isLoadedPdf = true;
      }
      reader.readAsArrayBuffer(selFile); 
    }
  }

  reset() {    
    //this.filename =null;    
    this.pdfSrc = null;
    this.field.formControl.setValue(null);
    this.field.formControl.markAsTouched();
    //this.filePdfInput.nativeElement.value = "";   
    this.isLoadedPdf= false;
  }

  onClick(){
    //this.filePdfInput.nativeElement.click();
  }



}
