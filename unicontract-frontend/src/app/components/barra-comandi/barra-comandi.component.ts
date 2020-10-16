import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteMetods } from '../../classes/routeMetods';

@Component({
  selector: 'app-barra-comandi',
  templateUrl: './barra-comandi.component.html',
  styleUrls: [],
  styles: []
})
// ng g c components/barraComandi -s true --spec false -t true
export class BarraComandiComponent implements OnInit {

  static keyValuePath: { [key: string]: string} = {
    'A1': 'home/anagrafica',
    'A2': 'home/pagamento/update',
    'P2': 'home/p2rapporto',
    'B1': 'home/conflitto',
    'B2': 'home/incompat',
    'B3': 'home/studio',
    'B4': 'home/rapppa',
    'B5': 'home/pension',
    'B6': 'home/privacy',
    'C':  'home/cpiva',
    'D1': 'home/inps',
    'D2': 'home/inail',
    'D3': 'home/tributari',
    'D4': 'home/fiscali',
    'D5': 'home/fiscaliestero',
    'D6': 'home/familiari',
    'E': 'home/occasionale',
  };

  static keyValueId: { [key: string]: string} = {
    'A1': 'a1_anagrafica_id',
    'A2': 'a2_mod_pagamento_id',
    'P2': 'p2_natura_rapporto_id',
    'B1': 'b1_confl_interessi_id',
    'B2': 'b2_incompatibilita_id',
    'B3': 'b3_rapp_studio_univ_id',
    'B4': 'b4_rapp_pubbl_amm_id',
    'B5': 'b5_stato_pensionam_id',
    'B6': 'b6_trattamento_dati_id',
    'C':  'c_prestaz_profess_id',
    'D1': 'd1_inps_id',
    'D2': 'd2_inail_id',
    'D3': 'd3_tributari_id',
    'D4': 'd4_fiscali_id',
    'D5': 'd5_fiscali_resid_estero_id',
    'D6': 'd6_detraz_fam_carico_id',
    'E': 'e_autonomo_occasionale_id',
  };



  @Input() item: any = null;
  @Input() type: string;

  @Output() sendEmail = new EventEmitter();
  @Output() updateInsegnamento: EventEmitter<number> = new EventEmitter();

  constructor(private route: ActivatedRoute,
    private router: Router,  public goto: RouteMetods) { }

  ngOnInit() {
  }

  currentButton(type) {
    if (this.type === type) {
      return true;
    }
    return false;
  }

  isDisabled(type){
    return this.type == type;
  }

  getClassName(type) {
    if (this.type === type) {
      return 'btn btn-success rounded mr-1';
    }
    return 'btn btn-outline-secondary rounded mr-1';
  }
  

  disabledUpdate() {
    return this.item.stato === 1;
  }

  isBlocked() {
    if (this.item.stato == 2 || this.item.stato==3){
      return true;
    }else if (this.item.validazioni) {
     
      //moduli bloccati dalla validazione amministrativa
      if (this.isValidatoAmm() && ['A1','A2', 'P2', 'B1', 'B2', 'B3','B4', 'B5', 'B6'].includes(this.type)){
        return true;
      }

      return this.item.validazioni.blocked;
    } else {
      console.log('ASSENTI dati di validazione');
    }
  }

  update(item) {
    const id = BarraComandiComponent.keyValueId[this.type];
    const path = BarraComandiComponent.keyValuePath[this.type];
    console.log(path);
    console.log(id);
    this.router.navigate([path, this.item[id], {upd: 'on'}]);

  }

  // stati
  isCompilato() {
    return this.item.validazioni.flag_submit === 1;
  }

  isValidatoAmm() {
    return this.item.validazioni.flag_upd === 1 && this.isCompilato();
  }

  isValidatoEconomica() {
    return this.item.validazioni.flag_amm === 1 && this.isValidatoAmm();
  }

}
