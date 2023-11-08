class User {
    active: boolean;
    birthDate: Date;
    dni: string;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    password: string;
    phone: number;
    userName: string;
    userType: string;
    _id: string;

    constructor(userData: User){
        this.active= userData.active;
        this.birthDate= userData.birthDate;
        this.dni= userData.dni;
        this.email= userData.email;
        this.firstName= userData.firstName;
        this.id= userData.id;
        this.lastName= userData.lastName;
        this.password= userData.password;
        this.phone= userData.phone;
        this.userName= userData.userName;
        this.userType= userData.userType;
        this._id=userData._id;
    }
}

export default User;