import { Suspense } from "react";
import UserForm from "../components/UserForm/UserForm";
import {
  checkUserAuthentication,
  getAuthToken,
  getAuthUserId,
  getIsAdmin,
  setLocalStorageTokens,
} from "../utils/auth";
import { getUserById, isLoggedIn, queryClient, updateUser } from "../utils/http";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import User from "../models/user";
import { Box } from "@mui/material";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  birthDate: string;
  userType: string;
  active: boolean;
  googleId: string;
}

interface LoaderData {
  user: User;
  adminEditing: boolean;
}

export const UserActionsPage = (): JSX.Element => {
  const loaderData = useLoaderData() as LoaderData;
  return (
    <Box component="section" width={"60%"} mx={"auto"} mt={2} maxWidth={"50rem"} p={2}>
      <Suspense fallback={<p>Cargando usuario...</p>}>
        <Await resolve={loaderData.user}>
          {(user) => {
            if (user) {
              return (
                <UserForm user={user} adminEditing={loaderData.adminEditing} />
              );
            }
            return <p>Usuario no encontrado</p>;
          }}
        </Await>
      </Suspense>
    </Box>
  );
};

export const loader = async ({ params }: { params?: { userId?: string } }) => {
  const isLogged = await isLoggedIn();
  if (isLogged) {
    return redirect("/agenda");
  }

  const userId = params?.userId;
  if (!userId) {
    return false;
  }

  try {
    const user = getUserById(userId);
    return defer({ user, adminEditing: false });
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};

export const updateLoader = async ({
  params,
}: {
  params?: { userId?: string };
}): Promise<Error | LoaderData | Response> => {
  const isLoggedIn = checkUserAuthentication();
  if (!isLoggedIn) {
    return redirect("/login");
  }

  const userId = params?.userId;
  if (!userId) {
    return redirect("/agenda");
  }

  const userLoggedInId = getAuthUserId();
  if (!userLoggedInId) {
    return redirect("/login");
  }

  try {
    const user = await getUserById(userId);
    const isAdmin = getIsAdmin();

    if (userLoggedInId === user._id || isAdmin !== null) {
      return { user, adminEditing: isAdmin ? true : false };
    }

    return redirect("/agenda");
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};

const formatDataFromRequest = async (
  request: Request
): Promise<{ userData: UserData; id: string }> => {
  const formData = await request.formData();
  const userData: UserData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    dni: formData.get("dni") as string,
    phone: formData.get("phone") as string,
    birthDate: formData.get("birthDate") as string,
    userType: formData.get("userType") as string,
    active: JSON.parse(formData.get("active") as string),
    googleId: formData.get("googleId") as string,
  };
  const userId = formData.get("id") as string;
  return { userData, id: userId };
};

/**
 * Updates the user data and redirects to the agenda page.
 * @param {Object} options - The options object.
 * @param {Object} options.request - The request object.
 * @returns {Promise<void>} - A promise that resolves when the user data is updated and the redirect is complete.
 */
export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Error | Response> => {
  try {
    const { userData, id } = await formatDataFromRequest(request);
    const response = await updateUser(id, userData);
    const token = getAuthToken();
    if (!token) {
      setLocalStorageTokens(response.user);
    }
    queryClient.invalidateQueries({queryKey: ["users"]});
    return redirect("/agenda");
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};
