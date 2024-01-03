import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import CalendarComponent from "../components/Calendar/Calendar";
import { getAuthUserId, checkUserAuthentication } from "../utils/auth";
import {
  getProfessionals,
  getServices,
  getShifts,
  getUserById,
  getUsers,
} from "../utils/http";
import { Suspense } from "react";
import Loading from "../components/UI/Loading";
import SectionContainer from "../components/UI/SectionContainer";

export const CalendarPage = () => {
  const { data, user } = useLoaderData();
  return (
    <SectionContainer cssClasses="calendar">
      <Suspense fallback={<Loading />}>
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
    const user = await getUserById(userId);

    const data = Promise.all([
      getProfessionals(),
      getShifts(),
      getUsers(),
      getServices(),
    ]);

    return defer({ data, user });
  } catch (error) {
    if (error.message === "redirect to login") {
      return redirect("/logout");
    }
    console.error(error);
    throw error;
  }
};
