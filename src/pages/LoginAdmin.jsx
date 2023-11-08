import LoginForm from "../components/LoginForm";
import { login } from "../utils/http";
import { redirect } from "react-router-dom";

const LoginAdminPage = () => {
  return <LoginForm />;
};

export default LoginAdminPage;

const extractFormData = async (request) => {
  const formData = await request.formData();
  return {
    userName: formData.get("userName"),
    password: formData.get("password"),
  };
};

const setLocalStorageTokens = (user) => {
  localStorage.setItem("token", user.userName);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 5); // 5 hours of session
  localStorage.setItem("tokenExpiration", expiration);

  if (user.userType === "admin") {
    localStorage.setItem("admin", true);
  } else {
    localStorage.removeItem("admin");
  }
};

export const action = async ({ request }) => {
  try {
    const { userName, password } = await extractFormData(request);

    const user = await login({ userName, password });

    if (user) {
      if (!user.active) {
        return { message: "Usuario inactivo, contacte al admin" };
      }

      setLocalStorageTokens(user);

      return redirect("/agenda");
    } else {
      return { message: "Usuario o contraseña incorrectos" };
    }
  } catch (error) {
    return error;
  }
};
