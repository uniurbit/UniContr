import { CPrestazProfessInterface } from './../interface/cPrestazProfessionale.interface';

export class CPrestazProfess implements CPrestazProfessInterface {
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
    insegn_id?: number;
    regime_fiscale: string;

    constructor() {
        this.id = 0;
        this.piva = '';
        this.intestazione = '';
        this.tipologia = false;
        this.flag_albo = false;
        this.denominazione_albo = '';
        this.provincia_albo = '';
        this.num_iscrizione_albo = '';
        this.data_iscrizione_albo = '';
        this.flag_cassa = false;
        this.denominazione_cassa = '';
        this.contributo_cassa = false;
        this.flag_rivalsa = false;
        this.flag_regime_fiscale = false;
    }
    
}

