import { Suspense } from "react";
import UserForm from "../components/UserForm/UserForm";
import {
  checkUserAuthentication,
  getAuthToken,
  getAuthUserId,
  getIsAdmin,
  setLocalStorageTokens,
} from "../utils/auth";
import {
  getUserById,
  isLoggedIn,
  queryClient,
  updateUser,
} from "../utils/http";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import User from "../models/user";
import Sign from "../components/Sign/Sign";
import Loading from "../components/UI/Loading";
import SectionContainer from "../components/UI/SectionContainer";

interface LoaderData {
  user: User;
  adminEditing: boolean;
}

export const UserActionsPage = (): JSX.Element => {
  const loaderData = useLoaderData() as LoaderData;
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={loaderData.user}>
        {(user) => {
          if (user) {
            return (
              <SectionContainer>
                <UserForm user={user} adminEditing={loaderData.adminEditing} />
              </SectionContainer>
            );
          }
          return <Sign title="Crear Usuario" />;
        }}
      </Await>
    </Suspense>
  );
};

export const loader = async ({ params }: { params?: { userId?: string } }) => {
  const isLogged = await isLoggedIn();
  if (!isLogged) {
    return redirect("/login");
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

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Error | Response> => {
  try {
    const userData = await request.formData();
    const updatedUserData = Object.fromEntries(userData);
    const userId = updatedUserData._id;
    delete updatedUserData._id;
    delete updatedUserData.__v;
    
    const response = await updateUser(userId, updatedUserData);
    const token = getAuthToken();
    if (!token) {
      setLocalStorageTokens(response.user);
    }
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return redirect("/agenda");
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};