import ShiftForm from "../components/ShiftForm";
import { redirect } from "react-router-dom";
import { getAuthToken } from "../utils/auth";
import {
  createClient,
  createShift,
  getClientbyPhone,
  getHairDressers,
  getServices,
  getShiftbyId,
  getUserByUsername,
} from "../utils/http";

export const loader = async ({params}) => {

  const userName = getAuthToken();
  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  try {
    const user = await getUserByUsername(userName);

    if (!user || user.userType === "hairsalon") {
      return redirect("/login");
    }

    const [hairDressers, services, shift] = await Promise.all([
      getHairDressers(),
      getServices(),
      getShiftbyId(params && params.shiftId)
    ]);

    const formattedServices = Object.entries(services).map(([key, value]) => ({
      key,
      services: value,
    }));

    console.log(formattedServices, "formattedServices");
    const data = {
      hairDressers,
      user,
      services: formattedServices[0]?.services,
      shift,
    };

    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};

export const action = async ({ request }) => {
  const data = await request.formData();
  const clientData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    phone: data.get("phone"),
  };

  const shiftData = {
    ...clientData,
    professional: data.get("professional"),
    service: data.get("service"),
    subService: data.get("subService"),
    shiftDate: data.get("shiftDate"),
    time: data.get("time"),
    duration: data.get("duration"),
    detail: data.get("detail"),
    shiftCreator: data.get("shiftCreator"),
  };

  console.log(clientData, "clientData");
  console.log(shiftData, "shiftData");

  try {
    const client = await getClientbyPhone(clientData.phone);
    if (!client) {
      await createClient(clientData);
    }
    await createShift(shiftData);
  } catch (error) {
    return error;
  }

  return redirect("../");
};

const ShiftActionsPage = () => {
  return <ShiftForm />;
};

export default ShiftActionsPage;
