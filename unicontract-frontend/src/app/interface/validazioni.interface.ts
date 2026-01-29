export interface ValidazioneInterface {
    id: number;
    insegn_id: number;
    flag_submit: boolean;
    date_submit: string;
    flag_upd: boolean;
    date_upd: string;
    flag_amm: boolean;
    date_amm: string;
    flag_make: boolean;
    date_make: string;
    flag_accept: boolean;
    date_accept: string;
}

export interface UpdateSubmit {
    insegn_id: number;
    flag_submit: boolean;
    date_submit: string;
}

export interface UpdateUpd {
    insegn_id: number;
    flag_upd: boolean;
    date_upd: string;
}

export interface UpdateAmm {
    insegn_id: number;
    flag_amm: boolean;
    date_amm: string;
}

export interface UpdateMake {
    insegn_id: number;
    flag_make: boolean;
    date_make: string;
}

export interface UpdateAccept {
    insegn_id: number;
    flag_accept: boolean;
    date_accept: string;
}
