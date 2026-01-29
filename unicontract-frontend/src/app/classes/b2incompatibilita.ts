import { B2IncompatibilitaInterface } from './../interface/b2incompatibilita.interface';

export class B2Incompatibilita implements B2IncompatibilitaInterface {
    id: number;
    flag_incompatibilita: boolean;

    constructor() {
        this.id = 0;
        this.flag_incompatibilita = false;
    }
}
