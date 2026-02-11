import { RuoloDocenteInterface } from './../interface/ruoloDocente.interface';

export class RuoloDocente implements RuoloDocenteInterface {
    role_id: number;
    model_type: string;
    model_id: number;

    constructor() {
        this.role_id = 0;
        this.model_type = '';
        this.model_id = 0;
    }
}
