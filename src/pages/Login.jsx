import LoginForm from "../components/LoginForm";
import { login } from "../utils/http";
import { redirect } from "react-router-dom";

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userName = formData.get("userName");
  const password = formData.get("password");

  try {
    const user = await login({ userName, password });

    if (user) {
      localStorage.setItem("token", user.userName);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("tokenExpiration", expiration);

      if (user.userType === "admin") {
        localStorage.setItem("admin", true);
      } else {
        localStorage.removeItem('admin');
      }

      return redirect("/agenda");
    } else {
      return { message: "Usuario o contraseña incorrectos" };
    }
  } catch (error) {
    return error;
  }
};
