import ShiftForm from "../components/ShiftForm";
import { redirect } from "react-router-dom";
import { checkUserAuthentication, getAuthUserId } from "../utils/auth";
import {
  createClient,
  createShift,
  getClientbyPhone,
  getProfessionals,
  getServices,
  getShiftbyId,
  getUserById,
  sendMessageToConfirmShift,
  updateShift,
} from "../utils/http";

export const loader = async ({ params }) => {
  const isLoggedIn = checkUserAuthentication();
  if (!isLoggedIn) {
    return redirect("/login");
  }

  try {
    const userId = getAuthUserId();
    const user = await getUserById(userId);

    if (!user || user.userType === "hairsalon") {
      return redirect("/login");
    }

    const [professionals, services] = await Promise.all([
      getProfessionals(),
      getServices(),
    ]);

    const shiftId = params && params.shiftId;
    let shift;

    if (shiftId) {
      shift = await getShiftbyId(params && params.shiftId);
    }

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
    console.log("error", error);
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
    professionalId: data.get("professionalId"),
    serviceId: data.get("serviceId"),
    subServiceId: data.get("subServiceId"),
    date: data.get("date"),
    time: data.get("time"),
    duration: data.get("duration"),
    detail: data.get("detail"),
    creatorId: data.get("creatorId"),
    clientConfirmed: JSON.parse(data.get("clientConfirmed")),
    professionalConfirmed: JSON.parse(data.get("professionalConfirmed")),
  };

  return { clientData, shiftData };
};

export const action = async ({ request }) => {
  try {
    const { clientData, shiftData } = await extractFormData(request);
    const client = await getClientbyPhone(clientData.phone);
    let response;

    if (!client) {
      response = await createClient(clientData);
    }

    const clientId = client ? client._id : response.client._id;

    const newShift = await createShift({...shiftData, clientId, attended: false});
    // await sendMessageToConfirmShift(
    //   { ...shiftData, id: newShift.shift._id },
    //   "professional"
    // );
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
