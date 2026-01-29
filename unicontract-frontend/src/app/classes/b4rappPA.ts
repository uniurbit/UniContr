import { B4RapportoPAInterface } from './../interface/b4rapportoPA.interface';

export class B4RapportoPA implements B4RapportoPAInterface {
    id: number;
    tipo_rapporto: string;
    tempo_pieno: boolean;
    iscrizione_albo: boolean;
    descrizione_albo: string;
    attivita_professionale: boolean;
    descrizione_attivita: string;
    sesso?: string;

    constructor() {
        this.id = 0;
        this.tipo_rapporto = '';
        this.tempo_pieno = false;
        this.iscrizione_albo = false;
        this.descrizione_albo = '';
        this.attivita_professionale = false;
        this.descrizione_attivita = '';
    }
}
