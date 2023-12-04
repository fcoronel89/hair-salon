import { Await, defer, redirect, useLoaderData } from "react-router-dom";
import CreateProfessionalForm from "../components/CreateProfessionalForm";
import {
  createProfessional,
  getProfessionalById,
  getServices,
  updateProfessional,
} from "../utils/http";
import { checkLoggedInAndHasAccess } from "../utils/auth";
import { Suspense } from "react";

export const ProfessionalPage = () => {
  const { data } = useLoaderData();
  return (
    <div style={{ maxWidth: "40rem", margin: "2rem auto" }}>
      <Suspense fallback={<p>Cargando Profesional...</p>}>
        <Await resolve={data.then((value) => value)}>
          {([services, professional]) => {
            return (
              <CreateProfessionalForm
                services={services}
                professional={professional}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

const checkAccessAndRedirect = () => {
  const isLoggedInAndHasAccess = checkLoggedInAndHasAccess("admin");
  if (!isLoggedInAndHasAccess) {
    return redirect("/login");
  }
};

export const loader = () => {
  try {
    checkAccessAndRedirect();

    const data = Promise.all([getServices(), false]);
    return defer({ data });
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateLoader = ({ params }) => {
  try {
    checkAccessAndRedirect();

    const professionalId = params && params.professionalId;

    const data = Promise.all([
      getServices(),
      getProfessionalById(professionalId),
    ]);

    return defer({ data });
  } catch (error) {
    console.error(error);
    return error;
  }
};

const processFormData = async (request) => {
  const data = await request.formData();

  const userData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    phone: data.get("phone"),
    birthDate: data.get("birthDate"),
    serviceType: data.get("serviceType").split(","),
    image: data.get("image"),
    dni: data.get("dni"),
    active: data.get("active"),
  };

  return userData;
};

export const action = async ({ request }) => {
  try {
    checkAccessAndRedirect();

    const professionalData = await processFormData(request);

    await createProfessional(professionalData);

    return { status: 200, message: "Profesional creado correctamente" };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateAction = async ({ request, params }) => {
  try {
    checkAccessAndRedirect();

    const professionalData = await processFormData(request);
    const professionalId = params?.professionalId;

    await updateProfessional(professionalData, professionalId);

    return { status: 200, message: "Profesional actualizado correctamente" };
  } catch (error) {
    console.error(error);
    return error;
  }
};
