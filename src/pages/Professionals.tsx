import { checkLoggedInAndHasAccess } from "../utils/auth";
import { getProfessionals } from "../utils/http";
import Professionals from "../components/Professionals";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

type Professional = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

export const ProfessionalsPage = () => {
  const loaderData: DefferedData = useLoaderData() as DefferedData;
  return (
    <div style={{ maxWidth: "65rem", margin: "2rem auto" }}>
      <Suspense fallback={<p>Cargando...</p>}>
        <Await
          resolve={loaderData.professionals}
          errorElement={<p>Error cargando los profesionales</p>}
        >
          {(loadedProfessionals) => (
            <Professionals professionals={loadedProfessionals} />
          )}
        </Await>
      </Suspense>
    </div>
  );
};

export interface DefferedData {
  professionals: Professional[];
}

export const loader = (): Promise<Error | Response | DefferedData> => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("admin");
  if (!isLoggedInAndHasAccess) {
    return Promise.resolve(redirect("/login"));
  }
  try {
    const professionals = getProfessionals();
    return Promise.resolve(
      defer({ professionals }) as unknown
    ) as Promise<DefferedData>;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};
