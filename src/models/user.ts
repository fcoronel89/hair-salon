import { UserType } from "../utils/helpers";

class User {
    active: boolean;
    birthDate?: Date | string;
    dni: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: number | string;
    userType: UserType;
    _id?: string;
    googleId: string;
    avatar?: string;
    neighbourhood?: string;

    constructor(userData: User){
        this.active= userData.active;
        this.birthDate= userData.birthDate;
        this.dni= userData.dni;
        this.email= userData.email;
        this.firstName= userData.firstName;
        this.lastName= userData.lastName;
        this.phone= userData.phone;
        this.userType= userData.userType;
        this._id=userData._id;
        this.googleId= userData.googleId;
        this.avatar= userData.avatar;
        this.neighbourhood= userData.neighbourhood;
    }
}

export default User;