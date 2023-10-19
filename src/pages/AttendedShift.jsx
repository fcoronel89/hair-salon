import { redirect } from "react-router-dom";
import { getShiftbyId, getUserByUsername } from "../utils/http";
import { getAuthToken } from "../utils/auth";
import AttendedShift from "../components/AttendedShift";

const AttendedShiftPage = () => {
  return <AttendedShift />;
};

export default AttendedShiftPage;

export const loader = async ({ params }) => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }
  try {
    const user = await getUserByUsername(userName);
    if (!user || user.userType === "seller") {
      return redirect("/agenda");
    }
    return await getShiftbyId(params && params.shiftId);
  } catch (error) {
    return error;
  }
};
