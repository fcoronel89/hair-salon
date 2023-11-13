import { redirect } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import { getAuthToken, getAuthUserId } from "../utils/auth";
import {
  getProfessionals,
  getServices,
  getShifts,
  getUserById,
  getUsers,
  isLoggedIn,
} from "../utils/http";
import { formatServices } from "../utils/helpers";

const CalendarPage = () => <CalendarComponent />;

export default CalendarPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
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

    const formattedServices = formatServices(services);
    const data = {
      professionals,
      user,
      shifts,
      users,
      services: formattedServices,
    };
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};
