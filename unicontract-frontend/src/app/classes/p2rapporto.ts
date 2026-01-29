import { P2rapportoInterface } from './../interface/p2rapporto';

export class P2rapporto implements P2rapportoInterface {
    id: number;
    flag_rapp_studio_univ: boolean;
    flag_dipend_publl_amm: boolean;
    flag_titolare_pensione: boolean;
    natura_rapporto: string;

    constructor() {
        this.id = 0;
        this.flag_rapp_studio_univ = false;
        this.flag_dipend_publl_amm = false;
        this.flag_titolare_pensione = false;
        this.natura_rapporto = '';
    }
}
