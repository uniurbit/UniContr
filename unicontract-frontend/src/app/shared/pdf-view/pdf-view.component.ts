import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { FormlyFieldConfig, Field, FormlyFormOptions } from '@ngx-formly/core';
import { FieldExpressionExtension } from '@ngx-formly/core/lib/extensions/field-expression/field-expression';
import { FormGroup } from '@angular/forms';

//https://github.com/VadimDez/ng2-pdf-viewer/issues/715
//https://github.com/stephanrauh/ngx-extended-pdf-viewer/issues/263
// import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf';
// pdfjsLib.GlobalWorkerOptions.workerSrc = 
//    'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.7.570/es5/build/pdf.worker.min.js';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.css']
})
export class PdfViewComponent implements OnInit {

  @Input() pdfSrc: any = null;

  isLoading: boolean = false;
  // screen DPI / PDF DPI
  readonly dpiRatio = 96 / 72;
  
  page: number = 1;
  totalPages: number;  
  zoom = 1;
  originalSize: boolean = true;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { 
   
  }

  ngOnInit() {   
    
  }

  pdfViewerEnabled(){
    return window.navigator['pdfViewerEnabled'];
  }

  loadComplete(event){
    this.isLoading=false;
  }

  onError(errorPDF:any){
    console.log(errorPDF);
  }

  onOpen(){
    let newWindow = window.open();//OPEN WINDOW FIRST ON SUBMIT THEN POPULATE PDF          
    const blob = new Blob([this.pdfSrc], { type: 'application/pdf' });  
    const fileURL = URL.createObjectURL(blob);        
    newWindow.location.href = fileURL;//POPULATING PDF             
  }

  onDownload(){    
    const blob = new Blob([this.pdfSrc]);
    saveAs(blob, 'download.pdf');

    // this.http.get(this.pdfSrc,{responseType: 'blob'}).subscribe(res =>{
    //   const names: string[] = this.pdfSrc.split('/');
    //   saveAs(res,names[names.length-1])
    // });
  }
    
 
}
