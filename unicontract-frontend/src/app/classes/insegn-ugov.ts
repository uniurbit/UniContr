import { InsegnUgovInterface } from './../interface/insegn-ugov';

export class InsegnUgov implements InsegnUgovInterface {
    coper_id: number;
    dip_des: string;
    nome_cds: string;
    aa_off_id: string;
    af_gen_cod: string;
    af_gen_des: string;
    sett_cod: string;
    sett_des: string;
    peso: string;
    des_tipo_ciclo: string;
    matricola: string;
    cognome: string;
    nome: string;
    sesso: string;
    cod_fis: string;
    ruolo_doc_cod: string;
    coper_peso: string;
    ore: number;
    data_ini_contratto: string;
    data_fine_contratto: string;
    compenso: string;
    tipo_coper_cod: string;
    tipo_atto_des: string;
    tipo_emitt_des: string;
    motivo_atto_cod: string;
    numero: string;
    data: string;
    contatore_insegnamenti?: number;

    constructor() {
        this.coper_id = 0;
        this.dip_des = '';
        this.nome_cds = '';
        this.aa_off_id = '';
        this.af_gen_cod = '';
        this.af_gen_des = '';
        this.sett_cod = '';
        this.sett_des = '';
        this.peso = '';
        this.des_tipo_ciclo = '';
        this.matricola = '';
        this.cognome = '';
        this.nome = '';
        this.sesso = '';
        this.cod_fis = '';
        this.ruolo_doc_cod = '';
        this.coper_peso = '';
        this.ore = 0;
        this.data_ini_contratto = '';
        this.data_fine_contratto = '';
        this.compenso = '';
        this.tipo_coper_cod = '';
        this.tipo_atto_des = '';
        this.tipo_emitt_des = '';
        this.motivo_atto_cod = '';
        this.numero = '';
        this.data = '';
    }

}
