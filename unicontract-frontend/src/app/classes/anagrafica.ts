import { AnagraficaInterface } from './../interface/anagrafica';
import { AnagraficaLocal } from './anagrafica-local';
import { AnagraficaLocalInterface } from '../interface/anagrafica-local.interface';

export class Anagrafica implements AnagraficaInterface {
    matricola: string;
    cognome: string;
    nome: string;
    stato_civ?: string;
    titolo_studio: string;
    sesso: string;
    data_nasc: string;
    loc_nasc: string;
    provincia: string;
    naz_nasc: string;
    ds_nazi: string;
    nazionalita: string;
    cod_fisc: string;
    cod_fis_estero: string;
    cod_fisc_coniuge: string;
    ind_res: string;
    civico_res: string;
    cap_res: string;
    comune_res: string;
    prov_res: string;
    nazi_res: string;
    tel_res: string;
    ind_rif: string;
    civico_rif: string;
    cap_rif: string;
    comune_rif: string;
    prov_rif: string;
    nazi_rif: string;
    tel_rif: string;
    ind_fis: string;
    civico_fis: string;
    cap_fis: string;
    comune_fis: string;
    prov_fis: string;
    nazi_fis: string;
    ds_onorifico: string;
    e_mail: string;
    e_mail_privata: string;
    tel_interno: string;
    fax: string;
    id_ab: string;
    email: string;

    constructor() {
        this.matricola = '';
        this.cognome = '';
        this.nome = '';
        this.stato_civ = '';
        this.sesso = '';
        this.data_nasc = '';
        this.loc_nasc = '';
        this.naz_nasc = '';
        this.ds_nazi = '';
        this.nazionalita = '';
        this.cod_fisc = '';
        this.cod_fis_estero = '';
        this.ind_res = '';
        this.civico_res = '';
        this.cap_res = '';
        this.comune_res = '';
        this.prov_res = '';
        this.nazi_res = '';
        this.tel_res = '';
        this.ind_rif = '';
        this.civico_rif = '';
        this.cap_rif = '';
        this.comune_rif = '';
        this.prov_rif = '';
        this.nazi_rif = '';
        this.tel_rif = '';
        this.ind_fis = '';
        this.civico_fis = '';
        this.cap_fis = '';
        this.comune_fis = '';
        this.prov_fis = '';
        this.nazi_fis = '';
        this.ds_onorifico = '';
        this.e_mail = '';
        this.e_mail_privata = '';
    }

    static toLocalAnagrafica(item): AnagraficaLocalInterface {
        return {
            sesso: item.sesso,
            nazione_nascita: item.naz_nasc,
            comune_nascita: item.loc_nasc,
            provincia_nascita: item.provincia,
            data_nascita: item.data_nasc,
            cf: item.cod_fisc,
            cf_coniuge: item.cod_fisc_coniuge,
            stato_civile: item.stato_civ,
            titolo_studio: item.titolo_studio,
            nazione_residenza: item.nazionalita,
            comune_residenza: item.comune_res,
            provincia_residenza: item.prov_res,
            cap_residenza: item.cap_res,
            indirizzo_residenza: item.ind_res,
            civico_residenza: item.civico_res,
            data_variazione_residenza: null,
            comune_fiscale: item.comune_fis,
            provincia_fiscale: item.prov_fis,
            cap_fiscale: item.cap_fis,
            indirizzo_fiscale: item.ind_fis,
            civico_fiscale: item.civico_fis,
            data_variazione_dom_fiscale: null,
            comune_comunicazioni: item.comune_rif,
            provincia_comunicazioni: item.prov_rif,
            cap_comunicazioni: item.cap_rif,
            indirizzo_comunicazioni: item.ind_rif,
            civico_comunicazioni: item.civico_rif,
            telefono_abitazione: item.tel_res,
            telefono_cellulare: item.tel_rif,
            telefono_ufficio: item.tel_interno,
            fax: item.fax,
            email: item.email,
            email_privata: item.e_mail_privata
        };
    }

}



