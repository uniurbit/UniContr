export interface EmailListInterface {
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
}
