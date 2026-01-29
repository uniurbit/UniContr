import { EmailListInterface } from './../interface/emailList.interface';

export class SendEmail implements EmailListInterface {
    id: number;
    model_type: string;
    model_id: number;
    sender_user_id: number;
    receiver_docente_id: number;
    receiver: string;
    codifica: string;
    oggetto: string;
    corpo_testo: string;
    group_id: string;

    constructor() {
        this.id = 0;
        this.model_type = '';
        this.model_id = 0;
        this.sender_user_id = 0;
        this.receiver_docente_id = 0;
        this.receiver = '';
        this.codifica = '';
        this.oggetto = '';
        this.corpo_testo = '';
        this.group_id = '';
    }
}
