import { A2ModPagamento } from './../interface/pagamento';

export class Pagamento implements A2ModPagamento {
    id: number;
    modality: string;
    tipologia_conto_corrente: string;
    iban: string;
    bic: string;
    denominazione: string;
    luogo: string;
    intestazione: string;
    aba: string;

    constructor() {
        this.id = 0;
        this.modality = '';
        this.tipologia_conto_corrente = '';
        this.iban = '';
        this.bic = '';
        this.denominazione = '';
        this.luogo = '';
        this.intestazione = '';
        this.aba = '';
    }
}
