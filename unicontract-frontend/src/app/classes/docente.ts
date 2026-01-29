import { DocenteInterface } from './../interface/docente.interface';

export class Docente implements DocenteInterface {
    v_ie_ru_personale_id_ab: number;
    name: string;
    email: string;
    password: string;
    cf: string;
    nome: string;
    cognome: string;

    constructor() {
        this.v_ie_ru_personale_id_ab = 0;
        this.name = '';
        this.email = '';
        this.password = '';
        this.cf = '';
        this.nome = '';
        this.cognome = '';
    }
}
