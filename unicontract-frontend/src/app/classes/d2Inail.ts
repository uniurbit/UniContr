import { D2InailInterface } from './../interface/d2Inail.interface';

export class D2Inail implements D2InailInterface {
    id: number;
    posizione_previdenziale: string;

    constructor() {
        this.id = 0;
        this.posizione_previdenziale = '';
    }
}
