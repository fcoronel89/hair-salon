import { Suspense } from "react";
import Users from "../components/Users";
import User from "../models/user";
import { checkUserAuthentication, getIsAdmin } from "../utils/auth";
import { getUsers } from "../utils/http";
import {
  Await,
  defer,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { queryClient } from "../utils/http";
import SectionContainer from "../components/UI/SectionContainer";
type LoaderData = {
  users: User[];
};

export const UsersPage: React.FC = () => {
  const loaderData = useLoaderData() as LoaderData;
  return (
    <SectionContainer>
      <Suspense fallback={<p>Cargando...</p>}>
        <Await
          resolve={loaderData.users}
          errorElement={<p>Error cargando los usuarios</p>}
        >
          <Users />
        </Await>
      </Suspense>
    </SectionContainer>
  );
};

export const loader = async () => {
  const isLoggedInClient = checkUserAuthentication();
  const isAdmin = getIsAdmin();
  if (!isLoggedInClient && !isAdmin) {
    return redirect("/login");
  }

  try {
    return defer({
      users: queryClient.fetchQuery({
        queryKey: ["users"],
        queryFn: () => getUsers(),
        staleTime: 10000,
      }) as Promise<User[]>,
    });
  } catch (error) {
    throw error;
  }
};
