import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PDFAnnotationData, PDFDocumentProxy } from 'pdfjs-dist';


@Component({
  selector: 'app-link-esterni',
  templateUrl: './link-esterni.component.html',
  styleUrls: ['./link-esterni.component.css']
})
export class LinkEsterniComponent implements OnInit {

  pdfSrc: string;
  isLoading: boolean = false;
  // screen DPI / PDF DPI
  readonly dpiRatio = 96 / 72;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (params.get('val') === 'ugovdidattica') {
          this.routeLgUgovDidattica();
        } else if (params.get('val') === 'ugovcompensi') {
          this.routeLgUgovCompensi();
        } else if (params.get('val') === 'precontreditabile') {
          this.routePrecontrEditabile();
        } else if (params.get('val') === 'compilazione') {
          this.routeCompilazione();
        }
      }
    );
  }

  routeLgUgovDidattica() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/lgocd_ugov_didattica.pdf';
  }

  routeLgUgovCompensi() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/lgocd_ugov_compensi.pdf';
  }

  routePrecontrEditabile() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/precontr_editabile.pdf';
  }

  routeCompilazione() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/compilazione-modulistica.pdf';
  }


  onOpen(){
    window.open(this.pdfSrc, '_blank');
  }

  onDownload(){
    
    this.http.get(this.pdfSrc,{responseType: 'blob'}).subscribe(res =>{
      const names: string[] = this.pdfSrc.split('/');
      saveAs(res,names[names.length-1])
    });
  }

  loadComplete(pdf: PDFDocumentProxy): void {
    this.isLoading = false;
  }
}
