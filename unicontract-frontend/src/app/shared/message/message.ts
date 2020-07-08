export class InfraMessage {
    type: InfraMessageType;
    message: string;
    error?: any;
}

export enum InfraMessageType {
    Success,
    Error,
    Info,
    Warning
}