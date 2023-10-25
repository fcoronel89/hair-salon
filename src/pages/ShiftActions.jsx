import ShiftForm from "../components/ShiftForm";
import { redirect } from "react-router-dom";
import { getAuthToken } from "../utils/auth";
import {
  createClient,
  createShift,
  getClientbyPhone,
  getProfessionals,
  getServices,
  getShiftbyId,
  getUserByUsername,
  sendMessageToConfirmShift,
  updateShift,
} from "../utils/http";

export const loader = async ({ params }) => {
  const userName = getAuthToken();
  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  try {
    const user = await getUserByUsername(userName);

    if (!user || user.userType === "hairsalon") {
      return redirect("/login");
    }

    const [professionals, services, shift] = await Promise.all([
      getProfessionals(),
      getServices(),
      getShiftbyId(params && params.shiftId),
    ]);

    const formattedServices = Object.entries(services).map(([key, value]) => ({
      key,
      services: value,
    }));

    console.log(formattedServices, "formattedServices");
    const data = {
      professionals,
      user,
      services: formattedServices[1]?.services,
      shift,
    };

    console.log(data);
    return data;
  } catch (error) {
    return error;
  }
};

const extractFormData = async (request) => {
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
    clientConfirmed: JSON.parse(data.get("clientConfirmed")),
    professionalConfirmed: JSON.parse(data.get("professionalConfirmed")),
  };

  return { clientData, shiftData };
};

export const action = async ({ request }) => {
  try {
    const { clientData, shiftData } = await extractFormData(request);
    const client = await getClientbyPhone(clientData.phone);
    if (!client) {
      await createClient(clientData);
    }

    const response = await createShift(shiftData);
    await sendMessageToConfirmShift(
      { ...shiftData, id: response.name },
      "professional"
    );
  } catch (error) {
    return error;
  }

  return redirect("../");
};

export const updateAction = async ({ request, params }) => {
  try {
    const { clientData, shiftData } = await extractFormData(request);

    const id = params && params.shiftId;

    const client = await getClientbyPhone(clientData.phone);
    if (!client) {
      await createClient(clientData);
    }
    await updateShift(shiftData, id);
  } catch (error) {
    return error;
  }

  return redirect("../");
};

const ShiftActionsPage = () => {
  return <ShiftForm />;
};

export default ShiftActionsPage;
