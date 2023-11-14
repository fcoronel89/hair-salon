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

const CalendarPage = () => <CalendarComponent />;

export default CalendarPage;

export const loader = async () => {
  const isLoggedInClient = checkUserAuthentication();
  if (!isLoggedInClient) {
    return redirect("/login");
  }

  try {
    const isLogged = await isLoggedIn();
    if (!isLogged) {
      return redirect("/logout");
    }

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
