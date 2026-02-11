import { B3RapportoStudioInterface } from './../interface/b3rappStudio.interface';

export class B3RapportoStudioUniversita implements B3RapportoStudioInterface {
    id: number;
    flag_rapporto_universita: boolean;

    constructor() {
        this.id = 0;
        this.flag_rapporto_universita = false;
    }
}
