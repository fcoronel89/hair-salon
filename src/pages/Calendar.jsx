import { redirect } from "react-router-dom";
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

export const CalendarPage = () => <CalendarComponent />;

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

    const [professionals, shifts, users, services] = await Promise.all([
      getProfessionals(),
      getShifts(),
      getUsers(),
      getServices(),
    ]);

    const data = {
      professionals,
      user,
      shifts,
      users,
      services,
    };
    console.log("data", data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
