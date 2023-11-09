import { redirect } from "react-router-dom";
import CreateProfessionalForm from "../components/CreateProfessionalForm";
import {
  createProfessional,
  getProfessionalByPhone,
  getProfessionalById,
  getServices,
  updateProfessional,
  getUserById,
} from "../utils/http";
import { getAuthToken, getAuthUserId } from "../utils/auth";

const ProfessionalPage = () => {
  return <CreateProfessionalForm />;
};

export default ProfessionalPage;

const checkAuthAndRedirect = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  const userId = getAuthUserId();

  const user = await getUserById(userId);

  if (!user || user.userType !== "admin") {
    return redirect("/login");
  }
};

const formatServices = (services) => {
  return services
    ? Object.entries(services).map(([id, service]) => ({
        id,
        services: service,
      }))[1].services
    : null;
};

export const loader = async () => {
  try {
    await checkAuthAndRedirect();

    const services = await getServices();
    const formattedServices = formatServices(services);
    return {
      services: formattedServices,
    };
  } catch (error) {
    return error;
  }
};

export const updateLoader = async ({ params }) => {
  try {
    await checkAuthAndRedirect();

    const professionalId = params && params.professionalId;

    const [services, professional] = await Promise.all([
      getServices(),
      getProfessionalById(professionalId),
    ]);

    const formattedServices = formatServices(services);
    return {
      services: formattedServices,
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
