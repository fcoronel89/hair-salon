import { redirect } from "react-router-dom";
import { checkUserAuthentication, setLocalStorageTokens } from "../utils/auth";
import Login from "../components/Login";
import { getUserById } from "../utils/http";

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;

export const loader = async ({ params }) => {
  const isLoggedIn = checkUserAuthentication();
  if (isLoggedIn) {
    return redirect("/agenda");
  }

  const userId = params && params.userId;
  if (!userId) {
    return true;
  }

  try {
    const user = await getUserById(userId);
    if (user) {
      setLocalStorageTokens(user);
      return redirect("/agenda");
    }
  } catch (error) {
    return error;
  }

  return true;
};
