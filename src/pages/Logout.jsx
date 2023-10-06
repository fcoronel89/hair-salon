import { redirect } from "react-router-dom";

export const action = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    return redirect('/login');
}