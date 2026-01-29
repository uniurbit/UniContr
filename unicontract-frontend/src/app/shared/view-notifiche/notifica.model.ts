

export class INotifica {
    id: string;
    messaggio: string;
    priorita: string;      
    riferimento: string;
    stato: string;
}

export enum NotificaPriorita {
  primario, secondario, eseguito, attenzione, evidenza, info, chiaro, scuro
}