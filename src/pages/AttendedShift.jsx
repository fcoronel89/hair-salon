import { redirect } from "react-router-dom";
import { getClientbyId, getShiftbyId } from "../utils/http";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import AttendedShift from "../components/AttendedShift";

const AttendedShiftPage = () => {
  return <AttendedShift />;
};

export default AttendedShiftPage;

export const loader = async ({ params }) => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("hairsalon");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
  try {
    const shift = await getShiftbyId(params && params.shiftId);
    const client = await getClientbyId(shift.clientId);
    return { shift, client };
  } catch (error) {
    return error;
  }
};
