import { D6DetrazioniFamiliariInterface } from './../interface/d6detrazionifamiliari.interface';

export class D6DetrazioniFamiliari implements D6DetrazioniFamiliariInterface {
    id: number;
    flag_richiesta_detrazioni: boolean;
    flag_coniuge_carico: boolean;
    dal_giorno: string;
    insegn_id?: number;

    constructor() {
        this.id = 0;
        this.flag_richiesta_detrazioni = false;
        this.flag_coniuge_carico = false;
        this.dal_giorno = '';
    }
}
