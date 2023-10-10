import { redirect } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { login } from "../utils/http";

const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;

export const action = async ({ request }) => {
  const data = await request.formData();
  const authData = {
    userName: data.get("userName"),
    password: data.get("password"),
  };
  console.log(authData);

  try {
    const user = await login(authData);
    if (user) {
      localStorage.setItem("token", user.userName);
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1);
      localStorage.setItem("tokenExpiration", expiration);
      if (user.userType === "admin") {
        localStorage.setItem("admin", true);
      }
    } else {
      return { message: "usuario o password incorrecta" };
    }
  } catch (error) {
    return error;
  }

  return redirect("/agenda");
};
