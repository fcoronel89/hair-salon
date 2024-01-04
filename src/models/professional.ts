export interface Professional {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  dni: string;
  image: string | File;
  birthDate: Date | string;
  serviceType: string[];
  active: boolean;
  __v?:number;
}
