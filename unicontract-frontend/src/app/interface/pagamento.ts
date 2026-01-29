export interface A2ModPagamento {
    id: number;
    modality: string;
    tipologia_conto_corrente: string;
    iban: string;
    bic: string;
    denominazione: string;
    luogo: string;
    intestazione: string;
    aba: string;    
    soluzione_pagamento?: string;
}
