import { EOccasionaleInterface } from './../interface/eOccasionale.interface';

export class EOccasionale implements EOccasionaleInterface {
    id: number;
    cod_limite_reddito: string;
    gestione_separata: number;
    importo: string;
    previdenza: string;
    cod_cassa_previdenziale: string;
    insegn_id?: number;

    constructor() {
        this.id = 0;
        this.cod_limite_reddito = '';
        this.gestione_separata = 0;
        this.importo = '';
        this.previdenza = '';
        this.cod_cassa_previdenziale = '';
    }
}
