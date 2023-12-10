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

export interface LoaderdData {
  professionals: Promise<Professional[]>;
}

export const ProfessionalsPage = () => {
  const loaderData = useLoaderData() as LoaderdData;
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

export const loader = ()=> {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("admin");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
  try {
    const professionals = getProfessionals();
    return defer({ professionals });
  } catch (error) {
    console.error(error);
    return error as Error;
  }
};
