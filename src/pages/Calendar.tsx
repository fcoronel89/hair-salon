import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import CalendarComponent from "../components/Calendar/Calendar";
import { getAuthUserId, checkUserAuthentication } from "../utils/auth";
import {
  getClients,
  getHairSalonUsers,
  getProfessionals,
  getServices,
  getShifts,
  getUserById,
  getUsers,
} from "../utils/http";
import { Suspense } from "react";
import Loading from "../components/UI/Loading";
import SectionContainer from "../components/UI/SectionContainer";

type LoaderData = {
  data: Promise<
    [
      Awaited<ReturnType<typeof getProfessionals>>,
      Awaited<ReturnType<typeof getShifts>>,
      Awaited<ReturnType<typeof getUsers>>,
      Awaited<ReturnType<typeof getServices>>,
      Awaited<ReturnType<typeof getHairSalonUsers>>,
      Awaited<ReturnType<typeof getClients>>
    ]
  >;
  user: Awaited<ReturnType<typeof getUserById>>;
};

export const CalendarPage = () => {
  const { data, user } = useLoaderData() as LoaderData;
  return (
    <SectionContainer cssClasses="calendar">
      <Suspense fallback={<Loading />}>
        <Await resolve={data.then((value) => value)}>
          {([
            professionals,
            shifts,
            users,
            services,
            hairSalonUsers,
            clients,
          ]) => (
            <CalendarComponent
              user={user}
              professionals={professionals}
              shifts={shifts}
              users={users}
              services={services}
              hairSalonUsers={hairSalonUsers}
              clients={clients}
            />
          )}
        </Await>
      </Suspense>
    </SectionContainer>
  );
};

const handleAuthentication = () => {
  const isLoggedInClient = checkUserAuthentication();
  if (!isLoggedInClient) {
    return redirect("/login");
  }
};

export const loader = async () => {
  try {
    handleAuthentication();

    const userId = getAuthUserId();

    if (!userId) {
      throw new Error("redirect to login");
    }

    const user = await getUserById(userId);

    if (!user || !user.active) {
      throw new Error("redirect to login");
    }

    if (!user.firstName) {
      return redirect("/crear-usuario/" + user._id);
    }

    const data = Promise.all([
      getProfessionals(),
      getShifts(),
      getUsers(),
      getServices(),
      getHairSalonUsers(),
      getClients(),
    ]);

    return defer({ data, user });
  } catch (error) {
    if (error instanceof Error && error.message === "redirect to login") {
      return redirect("/logout");
    }
    return redirect("/logout");
  }
};
