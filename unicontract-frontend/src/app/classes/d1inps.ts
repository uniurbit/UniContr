import { D1InpsInterface } from './../interface/d1inps.interface';

export class D1Inps implements D1InpsInterface {
    id: number;
    flag_obbligo_contributivo: boolean;
    flag_gestione_separata: boolean;
    flag_misura_ridotta: boolean;
    flag_partita_iva: boolean;
    specif_obbligo_contributivo: string;
    specif_gestione_separata: string;
    specif_misura_ridotta: string;
    data_pensione: string;
    cassa_gestioni_previdenziali: string;

    constructor() {
        this.id = 0;
        this.flag_obbligo_contributivo = false;
        this.flag_gestione_separata = false;
        this.flag_misura_ridotta = false;
        this.flag_partita_iva = false;
        this.specif_obbligo_contributivo = '';
        this.specif_gestione_separata = '';
        this.specif_misura_ridotta = '';
        this.data_pensione = '';
        this.cassa_gestioni_previdenziali = '';
    }
}
