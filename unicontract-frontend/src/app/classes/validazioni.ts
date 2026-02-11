import {ValidazioneInterface,
        UpdateSubmit,
        UpdateUpd,
        UpdateAmm,
        UpdateMake,
        UpdateAccept } from './../interface/validazioni.interface';

export class Validazione implements ValidazioneInterface {

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

    constructor() {
        this.id = 0;
        this.insegn_id = 0;
        this.flag_submit = false;
        this.date_submit = '';
        this.flag_upd = false;
        this.date_upd = '';
        this.flag_amm = false;
        this.date_amm = '';
        this.flag_make = false;
        this.date_make = '';
        this.flag_accept = false;
        this.date_accept = '';
    }
}

export class UpdSubmit implements UpdateSubmit {
    insegn_id: number;
    flag_submit: boolean;
    date_submit: string;

    constructor() {
        this.insegn_id = 0;
        this.flag_submit = false;
        this.date_submit = '';
    }
}

export class UpdUpd implements UpdateUpd {
    insegn_id: number;
    flag_upd: boolean;
    date_upd: string;

    constructor() {
        this.insegn_id = 0;
        this.flag_upd = false;
        this.date_upd = '';
    }
}

export class UpdAmm implements UpdateAmm {
    insegn_id: number;
    flag_amm: boolean;
    date_amm: string;

    constructor() {
        this.insegn_id = 0;
        this.flag_amm = false;
        this.date_amm = '';
    }
}

export class UpdMake implements UpdateMake {
    insegn_id: number;
    flag_make: boolean;
    date_make: string;

    constructor() {
        this.insegn_id = 0;
        this.flag_make = false;
        this.date_make = '';
    }
}

export class UpdAccept implements UpdateAccept {
    insegn_id: number;
    flag_accept: boolean;
    date_accept: string;

    constructor() {
        this.insegn_id = 0;
        this.flag_accept = false;
        this.date_accept = '';
    }
}

