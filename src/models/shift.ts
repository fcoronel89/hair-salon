export interface Shift {
    _id?: string;
    date: Date | string;
    duration: number | string;
    professionalId: string;
    serviceId: string;
    subServiceId: string;
    clientConfirmed: boolean;
    professionalConfirmed: boolean;
    detail: string;
    time: string;
    creatorId: string;
    attended?: boolean;
    clientId?: string;
}