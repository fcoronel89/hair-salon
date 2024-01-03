import {
  Await,
  redirect,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { getClientbyId, getShiftbyId } from "../utils/http";
import AttendedShift from "../components/AttendedShift";
import { Suspense } from "react";

export const AttendedShiftPage = () => {
  const { shift, client } = useLoaderData();
  const { data, user } = useRouteLoaderData("calendar");
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
              shifts={shifts}
            />
          );
        }}
      </Await>
    </Suspense>
  );
};
export const loader = async ({ params }) => {
  try {
    const shift = await getShiftbyId(params?.shiftId);
    const client = await getClientbyId(shift.clientId);
    return { shift, client };
  } catch (error) {
    console.error(error);
    if (error.message === "redirect to login") {
      return redirect("/logout");
    }
    return error;
  }
};
