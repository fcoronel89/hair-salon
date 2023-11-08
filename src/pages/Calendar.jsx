import { redirect } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import { getAuthToken, getAuthUserId } from "../utils/auth";
import {
  getProfessionals,
  getServices,
  getShifts,
  getUserById,
  getUsers,
} from "../utils/http";
import { formatServices } from "../utils/helpers";

const CalendarPage = () => <CalendarComponent />;

export default CalendarPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    console.log("not logged");
    return redirect("/login");
  }

  const userId = getAuthUserId();
  try {
    const user = await getUserById(userId);

    if (!user) {
      console.log("not found user");
      return redirect("/login");
    }

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
