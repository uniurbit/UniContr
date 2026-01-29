import { InsegnamentoInterface, UpdateP1 } from './../interface/insegnamento';

export class Insegnamento implements InsegnamentoInterface {
    id: number;
    insegn_id: number;
    coper_id: number;
    ruolo: string;
    insegnamento: string;
    settore: string;
    cod_settore: string;
    cfu: number;
    ore: number;
    cdl: string;
    data_ini_contr: string;
    data_fine_contr: string;
    ciclo: string;
    aa: string;
    dipartimento: string;
    compenso: string;
    tipo_contratto: string;
    tipo_atto: string;
    emittente: string;
    motivo_atto: string;
    num_delibera: string;
    data_delibera: string;
    cod_insegnamento: number;
    stato: number;
    storico: number;
    user_role: string;
    dip_cod: string;

    nominativo?: string;
    docente_id?: string;
    contatore_insegnamenti_manuale?: number;
    contatore_insegnamenti?: any;
    motivazione_contatore?: string;
    sorgente_rinnovo?: any;

    constructor() {
        this.id = 0;
        this.coper_id = 0;
        this.insegn_id = 0;
        this.ruolo = '';
        this.insegnamento = '';
        this.settore = '';
        this.cod_settore = '';
        this.cfu = 0;
        this.ore = 0;
        this.cdl = '';
        this.data_ini_contr = '';
        this.data_fine_contr = '';
        this.ciclo = '';
        this.aa = '';
        this.dipartimento = '';
        this.compenso = '';
        this.tipo_contratto = '';
        this.tipo_atto = '';
        this.emittente = '';
        this.motivo_atto = '';
        this.num_delibera = '';
        this.data_delibera = '';
        this.cod_insegnamento = 0;
        this.stato = 0;
        this.storico = 0;
        this.user_role = '';
    }
}

export class Updp1 implements UpdateP1 {
    cfu: number;
    ore: number;
    data_ini_contr: string;
    data_fine_contr: string;
    compenso: string;
    tipo_contratto: string;
    tipo_atto: string;
    emittente: string;
    motivo_atto: string;
    num_delibera: string;
    data_delibera: string;

    constructor() {
        this.cfu = 0;
        this.ore = 0;
        this.data_ini_contr = '';
        this.data_fine_contr = '';
        this.compenso = '';
        this.tipo_contratto = '';
        this.tipo_atto = '';
        this.emittente = '';
        this.motivo_atto = '';
        this.num_delibera = '';
        this.data_delibera = '';
    }
}
