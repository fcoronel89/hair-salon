import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import { getAuthUserId, checkUserAuthentication } from "../utils/auth";
import {
  getProfessionals,
  getServices,
  getShifts,
  getUserById,
  getUsers,
  isLoggedIn,
} from "../utils/http";
import { Suspense } from "react";

export const CalendarPage = () => {
  const { data, user } = useLoaderData();
  return (
    <Suspense fallback={<p>Cargando Calendario...</p>}>
      <Await resolve={data.then((value) => value)}>
        {([professionals, shifts, users, services]) => (
          <CalendarComponent
            user={user}
            professionals={professionals}
            shifts={shifts}
            users={users}
            services={services}
          />
        )}
      </Await>
    </Suspense>
  );
};

const handleAuthentication = async () => {
  const isLoggedInClient = checkUserAuthentication();
  if (!isLoggedInClient) {
    return redirect("/login");
  }

  const isLogged = await isLoggedIn();
  if (!isLogged) {
    return redirect("/logout");
  }
};

export const loader = async () => {
  try {
    await handleAuthentication();

    const userId = getAuthUserId();
    const user = await getUserById(userId);

    const data = Promise.all([
      getProfessionals(),
      getShifts(),
      getUsers(),
      getServices(),
    ]);
    console.log("loader data");
    return defer({ data, user });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
