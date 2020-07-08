import { D3TributariInterface } from './../interface/d3tributari.interface';

export class D3Tributari implements D3TributariInterface {
    id: number;
    flag_percepito: boolean;
    flag_limite_percepito: boolean;

    constructor() {
        this.id = 0;
        this.flag_percepito = false;
        this.flag_limite_percepito = false;
    }
}
