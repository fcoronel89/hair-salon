import { Suspense } from "react";
import Users from "../components/Users";
import User from "../models/user";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import { getUsers } from "../utils/http";
import {
  Await,
  defer,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { queryClient } from "../utils/http";
type LoaderData = {
  users: User[];
};

export const UsersPage: React.FC = () => {
  const loaderData = useLoaderData() as LoaderData;
  return (
    <div style={{ maxWidth: "65rem", margin: "2rem auto" }}>
      <Suspense fallback={<p>Cargando...</p>}>
        <Await
          resolve={loaderData.users}
          errorElement={<p>Error cargando los usuarios</p>}
        >
          <Users />
        </Await>
      </Suspense>
    </div>
  );
};

export const loader = async () => {
  const isAdmin = await checkLoggedInAndHasAccess("admin");
  if (!isAdmin) {
    return redirect("/login");
  }

  try {
    return defer({
      users: queryClient.fetchQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
        staleTime: 20000,
      }) as Promise<User[]>,
    });
  } catch (error) {
    throw error;
  }
};
