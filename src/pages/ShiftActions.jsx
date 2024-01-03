import ShiftForm from "../components/ShiftForm/ShiftForm";
import {
  Await,
  redirect,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import {
  createClient,
  createShift,
  getClientbyId,
  getClientbyPhone,
  getServices,
  getShiftbyId,
  sendMessageToConfirmShift,
  updateShift,
} from "../utils/http";
import moment from "moment";
import { getDateInLocalTimezone } from "../utils/helpers";
import { Suspense } from "react";

export const ShiftActionsPage = () => {
  const navigate = useNavigate();
  const { data, user } = useRouteLoaderData("calendar");
  console.log("rootLoaderData", user);

  if (!user || user.userType === "hairsalon") {
    navigate("/login");
  }

  return (
    <Suspense fallback={<p>Cargando turno...</p>}>
      <Await resolve={data.then((value) => value)}>
        {([professionals, shifts, users, services]) => (
          <ShiftForm
            professionals={professionals}
            shifts={shifts}
            users={users}
            services={services}
            user={user}
          />
        )}
      </Await>
    </Suspense>
  );
};

export const loader = async ({ params }) => {
  try {
    const shiftId = params && params.shiftId;
    let shift, client;

    if (shiftId) {
      shift = await getShiftbyId(params && params.shiftId);
      const formatedDate = getDateInLocalTimezone(shift.date);
      shift.date = moment(formatedDate).format("YYYY-MM-DD");
      client = await getClientbyId(shift.clientId);
    }

    const data = {
      shift,
      client,
    };

    console.log(data);
    return data;
  } catch (error) {
    console.error("error", error);
    if (error.message === "redirect to login") {
      return redirect("/logout");
    }
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
