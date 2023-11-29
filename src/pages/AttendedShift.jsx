import { redirect } from "react-router-dom";
import { getClientbyId, getShiftbyId } from "../utils/http";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import AttendedShift from "../components/AttendedShift";

export const AttendedShiftPage = () => <AttendedShift />;

const handleAccessAndRedirect = () => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("hairsalon");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
};

export const loader = async ({ params }) => {
  try {
    handleAccessAndRedirect();

    const shift = await getShiftbyId(params?.shiftId);
    const client = await getClientbyId(shift.clientId);
    return { shift, client };
  } catch (error) {
    console.error(error);
    return error;
  }
};
