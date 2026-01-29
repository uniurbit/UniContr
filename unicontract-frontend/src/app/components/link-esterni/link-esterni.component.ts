import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { encode, decode } from 'base64-arraybuffer';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { saveAs } from 'file-saver';


@Component({
    selector: 'app-link-esterni',
    templateUrl: './link-esterni.component.html',
    styleUrls: ['./link-esterni.component.css'],
    standalone: false
})
export class LinkEsterniComponent implements OnInit {

  pdfSrc: string;
  isLoading: boolean = false;
  // screen DPI / PDF DPI
  readonly dpiRatio = 96 / 72;

  constructor(protected service: PrecontrattualeService, private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

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
        } else if (params.get('val') === 'firma') {
          this.routeFirma();
        } else if (params.get('val') === 'firmagrafometrica') {
          this.routeFirmaGrafometrica();
        } else if (params.get('val') === 'calcolo') {
          this.routeCalcolo();
        } else if (params.get('val') == 'download') {
          const buff = decode(params.get('id'));
          const id = new TextDecoder("utf-8").decode(buff);         
          this.downloadSelection(id);
        }
      }
    );
  }


  downloadSelection(id){
    this.isLoading = true;
    this.service.downloadContrattoFirmato(id).subscribe(file => {
      this.isLoading = false;
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { 
        this.isLoading = false;
        console.log(e); 
        this.router.navigate(['home/summary', id]);
      },
      () => {      
        this.router.navigate(['home/summary', id]);
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
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/precontr_editabile_10.pdf';
  }

  routeCompilazione() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/compilazione-modulistica.pdf';
  }

  routeFirma() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/firma_contratto_docenti.pdf';
  }

  routeFirmaGrafometrica() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/firma_grafometrica_contratto.pdf';
  }

  routeCalcolo() {
    this.isLoading = true;
    this.pdfSrc = location.origin + environment.baseHref + 'assets/documents/calcolo_modifica_numero_attribuzioni.pdf';
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
