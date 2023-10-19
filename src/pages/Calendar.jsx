import { redirect } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import { getAuthToken } from "../utils/auth";
import {
  getProfessionals,
  getShifts,
  getUserByUserNameWithId,
  getUsers,
} from "../utils/http";

const CalendarPage = () => <CalendarComponent />;

export default CalendarPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  try {
    const user = await getUserByUserNameWithId(userName);

    if (!user) {
      return redirect("/login");
    }

    const [professionals, shifts, users] = await Promise.all([
      getProfessionals(),
      getShifts(),
      getUsers(),
    ]);

    const data = { professionals, user, shifts, users };
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};
