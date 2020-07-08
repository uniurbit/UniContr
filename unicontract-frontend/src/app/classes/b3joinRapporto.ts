import { B3JoinRapportoInterface } from './../interface/b3joinRapporto.interface';

export class B3JoinRapporto implements B3JoinRapportoInterface {
    id: number;
    b3_rapp_studio_univ_id: number;
    universita: string;
    dipartimento: string;
    dal_giorno: string;
    al_giorno: string;
    tipologia_rapporto: string;
    riferimenti_legge: string;

    constructor() {
        this.id = 0;
        this.b3_rapp_studio_univ_id = 0;
        this.universita = '';
        this.dipartimento = '';
        this.dal_giorno = '';
        this.al_giorno = '';
        this.tipologia_rapporto = '';
        this.riferimenti_legge = '';
    }
}
