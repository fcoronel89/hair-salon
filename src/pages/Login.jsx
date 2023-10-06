import { redirect } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
    return <LoginForm />
}

export default LoginPage;

export const action = async ({ request }) => {

    const data = await request.formData();
    const authData = {
      user: data.get("user"),
      password: data.get("password"),
    };
    console.log(authData);
  
    const token = 'authenticated';
  
    localStorage.setItem("token", token);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem("tokenExpiration", expiration);
  
    return redirect("/");
  };
  