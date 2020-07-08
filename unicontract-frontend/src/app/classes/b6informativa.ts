import { B6InformativaInterface } from './../interface/b6informativa.interface';

export class B6Informativa implements B6InformativaInterface {
    id: number;
    flag_accettazione: boolean;
    insegn_id?: number;

    constructor() {
        this.id = 0;
        this.flag_accettazione = true;
    }
}
