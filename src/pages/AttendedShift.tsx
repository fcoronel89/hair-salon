import {
  Await,
  redirect,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { getClientbyId, getProfessionals, getServices, getShiftbyId, getShifts, getUserById, getUsers } from "../utils/http";
import AttendedShift from "../components/AttendedShift";
import { Suspense } from "react";

type LoaderData = {
  shift: Awaited<ReturnType<typeof getShiftbyId>>;
  client: Awaited<ReturnType<typeof getClientbyId>>;
}

type LoaderDataParent = {
  data: Promise<
    [
      Awaited<ReturnType<typeof getProfessionals>>,
      Awaited<ReturnType<typeof getShifts>>,
      Awaited<ReturnType<typeof getUsers>>,
      Awaited<ReturnType<typeof getServices>>
    ]
  >;
  user: Awaited<ReturnType<typeof getUserById>>;
}

export const AttendedShiftPage = () => {
  const { shift, client } = useLoaderData() as LoaderData;
  const { data, user } = useRouteLoaderData("calendar") as LoaderDataParent;
  const navigate = useNavigate();

  if (!user || user.userType !== "admin" || user.userType !== "hairsalon") {
    navigate("/login");
  }

  return (
    <Suspense fallback={<p>Cargando turno...</p>}>
      <Await resolve={data.then((value) => value)}>
        {([professionals, shifts, users, services]) => {
          return (
            <AttendedShift
              professionals={professionals}
              users={users}
              services={services}
              client={client}
              shift={shift}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};
export const loader = async ({ params }: { params?: { shiftId?: string } }) => {
  try {
    if (!params || !params.shiftId) {
      throw new Error("redirect to login");
    }
    const shift = await getShiftbyId(params.shiftId);
    const client = await getClientbyId(shift.clientId);
    return { shift, client };
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message === "redirect to login") {
      return redirect("/logout");
    }
    return error;
  }
};
