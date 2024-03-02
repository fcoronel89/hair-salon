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
  getHairSalonUsers,
  getUserById,
  queryClient,
  updateUser,
} from "../utils/http";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import User from "../models/user";
import Sign from "../components/Sign/Sign";
import Loading from "../components/UI/Loading";
import SectionContainer from "../components/UI/SectionContainer";

type LoaderData = {
  data: Promise<
    [
      Awaited<ReturnType<typeof getUserById>>,
      Awaited<ReturnType<typeof getHairSalonUsers>>
    ]
  >;
  adminEditing: boolean;
};

export const UserActionsPage = (): JSX.Element => {
  const { data, adminEditing } = useLoaderData() as LoaderData;
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={data.then((value) => value)}>
        {([user, hairSalonUsers]) => {
          if (user) {
            return (
              <SectionContainer>
                <UserForm
                  user={user}
                  hairSalonUsers={hairSalonUsers}
                  adminEditing={adminEditing}
                />
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
  const userId = params?.userId;
  if (!userId) {
    return false;
  }

  try {
    const data = Promise.all([getUserById(userId), getHairSalonUsers()]);
    return defer({ data, adminEditing: false });
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};

export const updateLoader = async ({
  params,
}: {
  params?: { userId?: string };
}) => {
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
    const data = Promise.all([getUserById(userId), getHairSalonUsers()]);
    const isAdmin = getIsAdmin();

    return defer({ data, adminEditing: isAdmin ? true : false });
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
    const userId = updatedUserData._id.toString();
    delete updatedUserData._id;
    delete updatedUserData.__v;

    console.log(updatedUserData);
    const response = await updateUser(userId, updatedUserData);
    const token = getAuthToken();
    if (!token) {
      setLocalStorageTokens(response.user);
    }
    queryClient.invalidateQueries({ queryKey: ["users"] });
    return redirect("/usuarios");
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};
