import { redirect } from "react-router-dom";
import CalendarComponent from "../components/Calendar";
import { getAuthToken } from "../utils/auth";
import { getHairDressers, getShifts, getUserByUsername } from "../utils/http";
const CalendarPage = () => {
    return <>
        <CalendarComponent />
    </>
}

export default CalendarPage;

export const loader = async () => {
    const userName = getAuthToken();
  
    if (!userName || userName === "Expired") {
      return redirect("/login");
    }
  
    let data;
  
    try {
      const user = await getUserByUsername(userName);
  
      if (!user || user.userType === "hairsalon") {
        return redirect("/login");
      }
      const hairDressers = await getHairDressers();
      if (hairDressers) {
        const shifts = await getShifts()
        data = { hairDressers, user, shifts };
      }
      console.log(data);
    } catch (error) {
      return error;
    }
  
    return data;
  };