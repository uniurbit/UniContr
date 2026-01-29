import { InsegnamentoInterface } from './insegnamento';
import { AnagraficaInterface } from './anagrafica';
import { B1ConflittoInterface } from './b1conflitto.interface';
import { DocenteInterface } from './docente.interface';

export interface PrecontrattualeInterface {
    id?: number;
    insegn_id: number;
    p2_natura_rapporto_id?: number;
    a1_anagrafica_id?: number;
    a2_mod_pagamento_id?: number;
    b1_confl_interessi_id?: number;
    b2_incompatibilita_id?: number;
    b3_rapp_studio_univ_id?: number;
    b4_rapp_pubbl_amm_id?: number;
    b5_stato_pensionam_id?: number;
    b6_trattamento_dati_id?: number;
    c_prestaz_profess_id?: number;
    d1_inps_id?: number;
    d2_inail_id?: number;
    d3_tributari_id?: number;
    d4_fiscali_id?: number;
    d5_fiscali_resid_estero_id?: number;
    d6_detraz_fam_carico_id?: number;
    e_autonomo_occasionale_id?: number;
    docente_id: number;
}

export interface UpdateP2 {
    insegn_id: number;
    p2_natura_rapporto_id: number;
}

export interface UpdateA1 {
    insegn_id: number;
    a1_anagrafica_id: number;
}

export interface UpdateA2 {
    insegn_id: number;
    a2_mod_pagamento_id: number;
}

export interface UpdateB1 {
    insegn_id: number;
    b1_confl_interessi_id: number;
}

export interface UpdateB2 {
    insegn_id: number;
    b2_incompatibilita_id: number;
}

export interface UpdateB3 {
    insegn_id: number;
    b3_rapp_studio_univ_id: number;
}

export interface UpdateB4 {
    insegn_id: number;
    b4_rapp_pubbl_amm_id: number;
}

export interface UpdateB5 {
    insegn_id: number;
    b5_stato_pensionam_id: number;
}

export interface UpdateB6 {
    insegn_id: number;
    b6_trattamento_dati_id: number;
}

export interface UpdateC {
    insegn_id: number;
    c_prestaz_profess_id: number;
}

export interface UpdateD1 {
    insegn_id: number;
    d1_inps_id: number;
}

export interface UpdateD2 {
    insegn_id: number;
    d2_inail_id: number;
}

export interface UpdateD3 {
    insegn_id: number;
    d3_tributari_id: number;
}

export interface UpdateD4 {
    insegn_id: number;
    d4_fiscali_id: number;
}

export interface UpdateD5 {
    insegn_id: number;
    d5_fiscali_resid_estero_id: number;
}

export interface UpdateD6 {
    insegn_id: number;
    d6_detraz_fam_carico_id: number;
}

export interface UpdateE {
    insegn_id: number;
    e_autonomo_occasionale_id: number;
}

export interface IPrecontrattuale {
    id?: number;
    insegnamento?: InsegnamentoInterface;
    anagrafica?: AnagraficaInterface;
    docente?: DocenteInterface;
    conflittointeressi?: B1ConflittoInterface;
    precontrattuale_sorgente?: any;
}

export interface InfraResponse<T> {
    data: T;
    success: boolean;
    message: string;
}

export interface IPrecontrStore<T> {    
    insegn_id: number;
    entity: T;
}
