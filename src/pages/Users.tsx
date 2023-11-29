import { Suspense } from "react";
import Users from "../components/Users";
import User from "../models/user";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import { getUsers } from "../utils/http";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";

export const UsersPage: React.FC = () => {
  const loaderData: User[] | unknown = useLoaderData();

  return (
    <div style={{ maxWidth: "65rem", margin: "2rem auto" }}>
      <Suspense fallback={<p>Cargando...</p>}>
        <Await
          resolve={loaderData.users}
          errorElement={<p>Error cargando los usuarios</p>}
        >
          {(loadedUsers) => <Users users={loadedUsers} />}
        </Await>
      </Suspense>
    </div>
  );
};

export const loader = async (): Promise<DeferredData<User[]>> => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("admin");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }

  try {
    const users: Promise<User[]> = getUsers();
    return defer({ users });
  } catch (error) {
    return error as Error;
  }
};
