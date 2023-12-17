import { checkUserAuthentication, getIsAdmin } from "../utils/auth";
import { getProfessionals } from "../utils/http";
import Professionals from "../components/Professionals";
import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import { queryClient } from "../utils/http";

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
          <Professionals />
        </Await>
      </Suspense>
    </div>
  );
};

export const loader = () => {
  const isLoggedInClient = checkUserAuthentication();
  const isAdmin = getIsAdmin();
  if (!isLoggedInClient && !isAdmin) {
    return redirect("/login");
  }
  try {
    return defer({
      professionals: queryClient.fetchQuery({
        queryKey: ["professionals"],
        queryFn: () => getProfessionals(),
        staleTime: 10000,
      }) as Promise<Professional[]>,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "redirect to login") {
      return redirect("/logout");
    }
    console.error(error);
    return error as Error;
  }
};
