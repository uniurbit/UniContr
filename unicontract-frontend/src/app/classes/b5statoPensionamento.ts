import { B5StatoPensionamentoInterface } from './../interface/b5statoPensionamento.interface';

export class B5StatoPensionamento implements B5StatoPensionamentoInterface {
    id: number;
    status: string;
    flag_rapp_collab_universita: boolean;

    constructor() {
        this.id = 0;
        this.status = '';
        this.flag_rapp_collab_universita = false;
    }
}
