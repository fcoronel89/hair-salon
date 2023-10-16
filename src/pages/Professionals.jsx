import { redirect } from "react-router-dom";
import { getAuthToken } from "../utils/auth";
import { getHairDressers, getUserByUsername } from "../utils/http";
import Professionals from "../components/Professionals";

const ProfessionalsPage = () => {
  return <Professionals />;
};

export default ProfessionalsPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  const user = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    return redirect("/login");
  }

  try {
    const professionals = await getHairDressers();
    if (!professionals) {
      return [];
    } else {
      const formattedProfessionals = Object.entries(professionals).map(
        ([id, professional]) => ({ id, ...professional })
      );
      return formattedProfessionals;
    }
  } catch (error) {
    return error;
  }
};
