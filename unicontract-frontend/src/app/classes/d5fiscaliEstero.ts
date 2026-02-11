import { D5FiscaliEsteroInterface } from './../interface/d5fiscaliEstero.interface';

export class D5FiscaliEstero implements D5FiscaliEsteroInterface {
    id: number;
    flag_convenzione_bilaterale: boolean;
    flag_gestione_separata: boolean;

    constructor() {
        this.id = 0;
        this.flag_convenzione_bilaterale = false;
        this.flag_gestione_separata = false;
    }
}
