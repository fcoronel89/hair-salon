export interface Shift {
    _id: string;
    date: Date;
    duration: number;
    professionalId: string;
    serviceId: string;
    userId: string;
    subServiceId: string;
    clientConfirmed: boolean;
    professionalConfirmed: boolean;
    detail: string;
    time: string;
    creatorId: string;
}