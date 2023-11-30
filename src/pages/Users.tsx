import { Suspense } from "react";
import Users from "../components/Users";
import User from "../models/user";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import { getUsers } from "../utils/http";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";

export const UsersPage: React.FC = () => {
  const loaderData: DefferedData = useLoaderData() as DefferedData;
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

export interface DefferedData {
  users: User[];
}

export const loader = (): Promise<Error | DefferedData | Response> => {
  const isAdmin = checkLoggedInAndHasAccess("admin");
  if (!isAdmin) {
    return Promise.resolve(redirect("/login"));
  }

  try {
    const users: Promise<User[]> = getUsers();
    return Promise.resolve(defer({ users }) as unknown) as Promise<DefferedData>;
  } catch (error) {
    return Promise.reject(error as Error);
  }
};
