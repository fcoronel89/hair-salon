import { redirect } from "react-router-dom";

export const getTokenDuration = () =>{
    const storedExpirationDate = localStorage.getItem('tokenExpiration');
    const expirationDate = new Date(storedExpirationDate);
    const now = new Date();
    const duration = expirationDate.getTime() - now.getTime();
    return duration;
}

export const getIsAdmin = () => {
    const isAdmin = localStorage.getItem('admin');
    return isAdmin;
}

export const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if(!token){
        return null;
    }
    const tokenDuration = getTokenDuration();
    if(tokenDuration <0){
        return 'Expired';
    }
    return token;
}   

export const tokenLoader = () => {
    return getAuthToken();
}

export const checkAuthLoader = () => {
    const token = getAuthToken();

    if(!token){
        return redirect('/login');
    }

    return null;
}