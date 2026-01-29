export interface InsegnamentoInterface {
    id: number;
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
}

export interface UpdateP1 {
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
}
