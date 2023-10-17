import { redirect } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import { getAuthToken } from "../utils/auth";
import { getProfessionals, getShifts, getUserByUsername } from "../utils/http";

const CalendarPage = () => <CalendarComponent />;

export default CalendarPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  try {
    const user = await getUserByUsername(userName);

    if (!user || user.userType === "hairsalon") {
      return redirect("/login");
    }

    const [professionals, shifts] = await Promise.all([
      getProfessionals(),
      getShifts(),
    ]);

    const data = { professionals, user, shifts };
    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};
