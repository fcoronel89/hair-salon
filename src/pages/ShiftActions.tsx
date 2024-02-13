import ShiftForm from "../components/ShiftForm/ShiftForm";
import {
  Await,
  redirect,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import {
  createClient,
  getClientbyId,
  getClientbyPhone,
  getHairSalonUsers,
  getProfessionals,
  getServices,
  getShiftbyId,
  getShifts,
  getUserById,
  getUsers,
  updateShift,
} from "../utils/http";
import moment from "moment";
import { getDateInLocalTimezone } from "../utils/helpers";
import { Suspense } from "react";

type LoaderDataParent = {
  data: Promise<
    [
      Awaited<ReturnType<typeof getProfessionals>>,
      Awaited<ReturnType<typeof getShifts>>,
      Awaited<ReturnType<typeof getUsers>>,
      Awaited<ReturnType<typeof getServices>>,
      Awaited<ReturnType<typeof getHairSalonUsers>>
    ]
  >;
  user: Awaited<ReturnType<typeof getUserById>>;
};

export const ShiftActionsPage = () => {
  const navigate = useNavigate();
  const { data, user } = useRouteLoaderData("calendar") as LoaderDataParent;

  if (!user || user.userType === "hairsalon") {
    navigate("/login");
  }

  return (
    <Suspense fallback={<p>Cargando turno...</p>}>
      <Await resolve={data.then((value) => value)}>
        {([professionals, shifts, users, services, hairSalonUsers]) => (
          <ShiftForm
            professionals={professionals}
            shifts={shifts}
            services={services}
            user={user}
            hairSalonUsers={hairSalonUsers}
          />
        )}
      </Await>
    </Suspense>
  );
};

export const loader = async ({ params }: { params?: { shiftId?: string } }) => {
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

    return data;
  } catch (error) {
    console.error("error", error);
    if (error instanceof Error && error.message === "redirect to login") {
      return redirect("/logout");
    }
    return error;
  }
};

interface FormData {
  clientData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shiftData: {
    professionalId: string;
    serviceId: string;
    subServiceId: string;
    date: string;
    time: string;
    duration: string;
    detail: string;
    creatorId: string;
    clientConfirmed: boolean;
    professionalConfirmed: boolean;
    neighbourhood: string;
    hairsalonId: string;
  };
}

const extractFormData = async (request: Request): Promise<FormData> => {
  const data = await request.formData();
  const clientData = {
    firstName: data.get("firstName") as string,
    lastName: data.get("lastName") as string,
    email: data.get("email") as string,
    phone: data.get("phone") as string,
  };

  const shiftData = {
    professionalId: data.get("professionalId") as string,
    serviceId: data.get("serviceId") as string,
    subServiceId: data.get("subServiceId") as string,
    date: data.get("date") as string,
    time: data.get("time") as string,
    duration: data.get("duration") as string,
    detail: data.get("detail") as string,
    creatorId: data.get("creatorId") as string,
    clientConfirmed: JSON.parse(data.get("clientConfirmed") as string),
    professionalConfirmed: JSON.parse(
      data.get("professionalConfirmed") as string
    ),
    neighbourhood: data.get("neighbourhood") as string,
    hairsalonId: data.get("hairsalonId") as string,
  };

  return { clientData, shiftData };
};


export const updateAction = async ({
  request,
  params,
}: {
  request: Request;
  params: { shiftId: string };
}) => {
  try {
    const { clientData, shiftData } = await extractFormData(request);

    if (!params.shiftId) {
      throw new Error("shiftId is required");
    }

    if (!clientData.phone) {
      throw new Error("phone is required");
    }

    const shiftId = params?.shiftId;

    const client = await getClientbyPhone(clientData.phone);
    let clientId;

    if (!client) {
      const response = await createClient(clientData);
      clientId = response._id;
    } else {
      clientId = client._id;
    }

    await updateShift({ ...shiftData, clientId, attended: false }, shiftId);
  } catch (error) {
    return error;
  }

  return redirect("../");
};
