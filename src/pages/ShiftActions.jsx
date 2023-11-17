import ShiftForm from "../components/ShiftForm";
import { redirect } from "react-router-dom";
import { checkUserAuthentication, getAuthUserId } from "../utils/auth";
import {
  createClient,
  createShift,
  getClientbyId,
  getClientbyPhone,
  getProfessionals,
  getServices,
  getShiftbyId,
  getUserById,
  sendMessageToConfirmShift,
  updateShift,
} from "../utils/http";
import moment from "moment";
import { getDateInLocalTimezone } from "../utils/helpers";

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
    let shift, client;

    if (shiftId) {
      shift = await getShiftbyId(params && params.shiftId);
      const formatedDate = getDateInLocalTimezone(shift.date);
      shift.date = moment(formatedDate).format("YYYY-MM-DD");
      client = await getClientbyId(shift.clientId);
    }


    const data = {
      professionals,
      user,
      services,
      shift,
      client,
    };

    console.log(data);
    return data;
  } catch (error) {
    console.error("error", error);
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

    const { shift } = await createShift({
      ...shiftData,
      clientId,
      attended: false,
    });

    let date = new Date(shiftData.date);
    date = moment(date).format("DD-MM-YYYY");

    const services = await getServices();
    const service = services.find(
      (service) => service._id === shiftData.serviceId
    );

    await sendMessageToConfirmShift(
      { ...shiftData, date, _id: shift._id, service: service.name },
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

    const shiftId = params?.shiftId;

    const client = await getClientbyPhone(clientData.phone);
    let response;

    if (!client) {
      response = await createClient(clientData);
    }

    const clientId = client ? client._id : response.client._id;

    await updateShift({ ...shiftData, clientId, attended: false }, shiftId);
  } catch (error) {
    return error;
  }

  return redirect("../");
};

const ShiftActionsPage = () => <ShiftForm />;

export default ShiftActionsPage;
