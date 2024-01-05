export interface Service {
    _id: string;
    name: string;
    subServices: SubService[];
}

export interface SubService {
    _id: string;
    name: string;
}