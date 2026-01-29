import { B1ConflittoInterface } from './../interface/b1conflitto.interface';

export class B1Conflitto implements B1ConflittoInterface {
    cariche: any[];
    incarichi: any[];
    id: number;
    flag_controll: boolean;
    flag_quota: boolean;
    flag_rappext: boolean;
    flag_contrast: boolean;
    flag_cariche: boolean;
    flag_incarichi: boolean;
    flag_attivita: boolean;
    descr_attivita: string;
    natura_rapporto: string;

    constructor() {
        this.id = 0;
        this.flag_controll = false;
        this.flag_quota = false;
        this.flag_rappext = false;
        this.flag_contrast = false;
        this.flag_cariche = false;
        this.flag_incarichi = false;
        this.flag_attivita = false;
        this.descr_attivita = '';

    }
}
