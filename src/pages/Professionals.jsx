import { checkLoggedInAndHasAccess } from "../utils/auth";
import { getProfessionals } from "../utils/http";
import Professionals from "../components/Professionals";
import { redirect } from "react-router-dom";

const ProfessionalsPage = () => {
  return <Professionals />;
};

export default ProfessionalsPage;

export const loader = async () => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("admin");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
  try {
    const professionals = await getProfessionals();
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
