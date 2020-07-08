import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pdf-infra',
  templateUrl: './pdf-infra.component.html',
  styles: []
})
export class PdfInfraComponent implements OnInit {

  page: number = 1;
  totalPages: number;  
  zoom = 1.0;
  originalSize: boolean = true;

  private _pdfFile: File
  @Input()
  get pdfFile(): File{
    return this._pdfFile;
  }
  set pdfFile(value: File){
    this._pdfFile = value;   
  }

  private _pdfSrc: ArrayBuffer;
  @Input()
  get pdfSrc(): ArrayBuffer{
    return this._pdfSrc;
  }
  set pdfSrc(value: ArrayBuffer){
    this._pdfSrc = value;   
  }

  isLoadedPdf = false;

  constructor() { }

  ngOnInit() {       
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


  ngOnChanges(changes: SimpleChanges) {
    if ('pdfFile' in changes) {
      if (this.pdfFile){
        if (typeof (FileReader) !== 'undefined') {           
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.pdfSrc = e.target.result;
            this.isLoadedPdf = true;
          };      
          reader.readAsArrayBuffer(this.pdfFile);                            
        }
      } else{      
        this.isLoadedPdf = false;
      }
    } else if ('pdfSrc' in changes){
      if (this._pdfSrc && this._pdfSrc.byteLength>0)
        this.isLoadedPdf = true;
      else
        this.isLoadedPdf = false;
    }
  }

}
