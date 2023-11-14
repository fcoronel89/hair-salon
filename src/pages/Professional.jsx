import { redirect } from "react-router-dom";
import CreateProfessionalForm from "../components/CreateProfessionalForm";
import {
  createProfessional,
  getProfessionalById,
  getServices,
  updateProfessional,
} from "../utils/http";
import { checkAuthAndRedirect } from "../utils/auth";

const ProfessionalPage = () => {
  return <CreateProfessionalForm />;
};

export default ProfessionalPage;

export const loader = async () => {
  try {
    const isLoggedIn = await checkAuthAndRedirect();
    if (!isLoggedIn) {
      return redirect("/login");
    }

    const services = await getServices();
    return { services };
  } catch (error) {
    return error;
  }
};

export const updateLoader = async ({ params }) => {
  try {
    const isLoggedIn = await checkAuthAndRedirect();
    if (!isLoggedIn) {
      return redirect("/login");
    }

    const professionalId = params && params.professionalId;

    const [services, professional] = await Promise.all([
      getServices(),
      getProfessionalById(professionalId),
    ]);

    return {
      services,
      professional,
    };
  } catch (error) {
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
    const professionalData = await processFormData(request);

    await createProfessional(professionalData);

    return { status: 200, message: "Profesional creado correctamente" };
  } catch (error) {
    return error;
  }
};

export const updateAction = async ({ request, params }) => {
  try {
    const professionalData = await processFormData(request);
    const professionalId = params?.professionalId;

    await updateProfessional(professionalData, professionalId);

    return { status: 200, message: "Profesional actualizado correctamente" };
  } catch (error) {
    return error;
  }
};
