import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteMetods } from 'src/app/classes/routeMetods';
import { InsegnamTools } from 'src/app/classes/insegnamTools';

@Component({
  selector: 'app-prosegui-button',
  template: `
  <button *ngIf="item && visible() && !annullato()" type="button" class="btn btn-outline-secondary rounded mr-1" (click)="onClick()" >
    <span title="{{ 'btn_togo' | translate }}">{{ 'btn_prosegui' | translate }}</span>
  </button>
  `,
  styleUrls: [],
})


export class ProseguiButtonComponent implements OnInit {

  @Input() item: any = null;
  @Input() type: string;

  constructor(private route: ActivatedRoute,
    private router: Router, public goto: RouteMetods) { }

  ngOnInit() {
  }

  //questo bottone compare in fondo a destra della pulsantiera e muove sempre alla successiva rispetto a quella corrente  
  visible(){
    return !InsegnamTools.termina(this.item);
  }

  annullato(){
    return this.item.stato == 2 || this.item.stato == 3;
  }

  onClick() {  
    let action = this.keyValueFunction[this.type];
    if (action){
      action();
    }    
  }

  currentB2(){
    //b2 -> b3 o b2->b4 o b2->b5 o b2->b6
    if (this.goto.controlButtonB3(this.item.flag_rapp_studio_univ)){
      this.goto.switchB3(this.item.insegn_id, this.item.b3_rapp_studio_univ_id);

    }else if (this.goto.controlButtonB4(this.item.flag_rapp_studio_univ, this.item.flag_dipend_pubbl_amm, 
                                        this.item.b3_rapp_studio_univ_id, this.item.b4_rapp_pubbl_amm_id)){
      this.goto.switchB4(this.item.insegn_id, this.item.b4_rapp_pubbl_amm_id);

    }else if (this.goto.controlButtonB5(this.item.flag_rapp_studio_univ, this.item.flag_dipend_pubbl_amm, 
                                        this.item.flag_titolare_pensione, this.item.b3_rapp_studio_univ_id, 
                                        this.item.b4_rapp_pubbl_amm_id, this.item.b5_stato_pensionam_id)){
      this.goto.switchB5(this.item.insegn_id, this.item.b5_stato_pensionam_id);

    }else if (this.goto.controlButtonB6(this.item.flag_rapp_studio_univ, this.item.flag_dipend_pubbl_amm, 
                                        this.item.flag_titolare_pensione, this.item.b3_rapp_studio_univ_id, 
                                        this.item.b4_rapp_pubbl_amm_id, this.item.b5_stato_pensionam_id)){
      this.goto.switchB6(this.item.insegn_id, this.item.b6_trattamento_dati_id);

    }    
  }

  currentB3(){
    //b3 -> b4 o b3 -> b5
    if (this.goto.fromB3toB4(this.item.flag_dipend_pubbl_amm)){
      this.goto.switchB4(this.item.insegn_id, this.item.b4_rapp_pubbl_amm_id);
    }else if (this.goto.fromB3toB5(this.item.flag_dipend_pubbl_amm, this.item.flag_titolare_pensione)){
      this.goto.switchB5(this.item.insegn_id, this.item.b5_stato_pensionam_id);
    }else if (this.goto.fromB3toB6(this.item.flag_dipend_pubbl_amm, this.item.flag_titolare_pensione, this.item.b6_trattamento_dati_id)){
      this.goto.switchB6(this.item.insegn_id, this.item.b6_trattamento_dati_id);
    }            
  }

  currentB4(){
    //b4 -> b5 o b4 -> b6
    if (this.goto.fromB4toB5(this.item.flag_titolare_pensione)){
      this.goto.switchB5(this.item.insegn_id, this.item.b5_stato_pensionam_id);
    }else if (this.goto.fromB4toB6(this.item.flag_titolare_pensione, this.item.b6_trattamento_dati_id)){
      this.goto.switchB6(this.item.insegn_id, this.item.b6_trattamento_dati_id);
    }    
  }

  currentB6() {
    //b6 -> C o b6 -> D1 o b6 -> E
    if (this.item.natura_rapporto === 'PRPR') {
      this.goto.switchC(this.item.insegn_id, this.item.c_prestaz_profess_id);      
    }else if (this.item.natura_rapporto === 'COCOCO'){
      this.goto.switchD1(this.item.insegn_id, this.item.d1_inps_id);
    }else if (this.item.natura_rapporto === 'PLAO'){
      this.goto.switchE(this.item.insegn_id, this.item.e_autonomo_occasionale_id);
    }
  }

  currentD4(){
    //D4 -> D5 o //D4 -> D6
    if (this.item.provincia_residenza === 'EE'){
      this.goto.switchD5(this.item.insegn_id, this.item.d5_fiscali_resid_estero_id)
    }else if (this.item.provincia_residenza !== 'EE' && this.item.d6_detraz_fam_carico_id === 0){
      this.goto.switchD6(this.item.insegn_id, this.item.d6_detraz_fam_carico_id);
    }    
  }

  keyValueFunction: { [key: string]:any} = {
    'P1': () => this.gotoP2(this.item.insegn_id, this.item.p2_natura_rapporto_id),
    'P2': () => this.gotoA1(this.item.userid, this.item.insegn_id, this.item.p2_natura_rapporto_id, this.item.a1_anagrafica_id),
    'A1': () => this.gotoA2(this.item.docente_id, this.item.insegn_id, this.item.a2_mod_pagamento_id),
    'A2': () => this.gotoB1(this.item.insegn_id, this.item.b1_confl_interessi_id),    
    'B1': () => this.gotoB2(this.item.insegn_id, this.item.b2_incompatibilita_id),
    'B2': () => this.currentB2(),
    'B3': () => this.currentB3(),
    'B4': () => this.currentB4(),
    'B5': () => this.goto.switchB6(this.item.insegn_id, this.item.b6_trattamento_dati_id),
    'B6': () => this.currentB6(),
    'C':  () => {},
    'D1': () => this.goto.switchD2(this.item.insegn_id, this.item.d2_inail_id),
    'D2': () => this.goto.switchD3(this.item.insegn_id, this.item.d3_tributari_id),
    'D3': () => this.goto.switchD4(this.item.insegn_id, this.item.d4_fiscali_id),
    'D4': () => this.currentD4(),
    'D5': () => this.goto.switchD6(this.item.insegn_id, this.item.d6_detraz_fam_carico_id),
    'D6': () => {},
    'E': () => {},
  };




  //funzioni di utilità 
  gotoP2(idins: number, idP2: number) {
    if (idP2 === 0) {
      this.router.navigate(['home/p2rapporto', idins]);
    } else {
      this.router.navigate(['home/p2rapporto/details', idP2]);
    }
  }

  gotoA1(id_ab: number, id: number, p2: number, a1: number) {
    if (a1 === 0) {
      this.router.navigate(['home/anagrafica', id_ab, { idins: id, p2id: p2 }]);
    } else {
      this.router.navigate(['home/anagrafica/local', a1]);
    }
  }

  gotoA2(id_ab: number, id_ins: number, a2value: number) {
    if (a2value === 0) {
      this.router.navigate(['home/pagamento', id_ab, { idins: id_ins }]);
    } else {
      this.router.navigate(['home/pagamento/local', a2value]);
    }
  }

  gotoB1(id: number, idb1: number) {
    if (idb1 === 0) {
      this.router.navigate(['home/conflitto', id]);
    } else {
      this.router.navigate(['home/conflitto/details', idb1]);
    }
  }

  gotoB2(id: number, idb2: number) {
    if (idb2 === 0) {
      this.router.navigate(['home/incompat', id]);
    } else {
      this.router.navigate(['home/incompat/details', idb2]);
    }
  }

 



}
