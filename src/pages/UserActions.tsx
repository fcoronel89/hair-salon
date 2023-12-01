import { Suspense } from "react";
import UserForm from "../components/UserForm";
import {
  checkUserAuthentication,
  getAuthToken,
  getAuthUserId,
  getIsAdmin,
  setLocalStorageTokens,
} from "../utils/auth";
import { getUserById, isLoggedIn, updateUser } from "../utils/http";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import User from "../models/user";

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

export interface DefferedData {
  user: User;
  adminEditing: boolean;
}

export const UserActionsPage = (): JSX.Element => {
  const loaderData: DefferedData = useLoaderData() as DefferedData;
  return (
    <div style={{ maxWidth: "40rem", margin: "2rem auto" }}>
      <Suspense fallback={<p>Cargando usuario...</p>}>
        <Await resolve={loaderData.user}>
          {(user) => {
            if (user) {
              return <UserForm user={user} adminEditing={loaderData.adminEditing} />;
            }
            return <p>Usuario no encontrado</p>;
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export const loader = async ({
  params,
}: {
  params?: { userId?: string };
}): Promise<{ user?: User } | boolean | Response | Error> => {
  const userId = params?.userId;
  if (!userId) {
    const isLogged = await isLoggedIn();
    if (isLogged) {
      return redirect("/agenda");
    }
    return false;
  }
  try {
    const user = getUserById(userId);
    return defer({ user, adminEditing: false }) as unknown as Promise<{ user?: User }>;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

export const updateLoader = async ({
  params,
}: {
  params?: { userId?: string };
}): Promise<
  { user?: any; adminEditing?: string | null } | void | Response | Error
> => {
  const isLoggedIn = checkUserAuthentication();
  if (!isLoggedIn) {
    return redirect("/login");
  }

  const userId = params && params.userId;
  if (!userId) {
    return redirect("/agenda");
  }

  const userLoggedInId = getAuthUserId();

  try {
    const user = await getUserById(userId);
    const isAdmin = getIsAdmin();

    if (userLoggedInId === user._id || isAdmin) {
      return { user, adminEditing: isAdmin };
    }

    return redirect("/agenda");
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
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
  return { userData, id: formData.get("id") as string };
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
}): Promise<void | Response | Error> => {
  try {
    const { userData, id }: { userData: UserData; id: string } =
      await formatDataFromRequest(request);
    const response = await updateUser(id, userData);
    const token: string | null = getAuthToken();
    if (!token) {
      setLocalStorageTokens(response.user);
    }
    return redirect("/agenda");
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};
