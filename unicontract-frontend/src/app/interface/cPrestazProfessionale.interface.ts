export interface CPrestazProfessInterface {
    id: number;
    piva: string;
    intestazione: string;
    tipologia: boolean;
    flag_albo: boolean;
    denominazione_albo: string;
    provincia_albo: string;
    num_iscrizione_albo: string;
    data_iscrizione_albo: string;
    flag_cassa: boolean;
    denominazione_cassa: string;
    contributo_cassa: boolean;
    flag_rivalsa: boolean;
    flag_regime_fiscale?: boolean;
    regime_fiscale: string;
}

