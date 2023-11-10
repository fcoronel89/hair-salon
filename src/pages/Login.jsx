import { redirect } from "react-router-dom";
import { getAuthToken, setLocalStorageTokens } from "../utils/auth";
import Login from "../components/Login";
import { getUserById } from "../utils/http";

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;

export const loader = async ({ params }) => {
  const userName = getAuthToken();

  console.log(userName);
  if (userName && userName !== "Expired") {
    return redirect("/agenda");
  }

  const userId = params && params.userId;
  if (!userId) {
    return true;
  }
  console.log("userId", userId);
  try {
    const user = await getUserById(userId);
    if (user) {
      setLocalStorageTokens(user);
      console.log("user", user);
      return redirect("/agenda");
    }
  } catch (error) {
    return error;
  }

  return true;
};
