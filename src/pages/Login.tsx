import { redirect } from "react-router-dom";
import { checkUserAuthentication, setLocalStorageTokens } from "../utils/auth";
import { getUserById } from "../utils/http";
import Sign from "../components/Sign/Sign";

export const LoginPage = () => {
  return <Sign title="Iniciar Sesion" />;
};

export const loader = async ({
  params,
}: {
  params?: { userId?: string };
}): Promise<true | Error | Response> => {
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
      if(user.firstName){
        return redirect("/agenda");
      } else {
        return redirect(`/crear-usuario/${user._id}`);
      }
    }
  } catch (error) {
    console.error(error);
    return error as Error;
  }

  return true;
};
