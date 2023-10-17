import { redirect } from "react-router-dom";
import CreateHairDresserForm from "../components/CreateHairDresserForm";
import {
  createHairDresser,
  getHairDresserByPhone,
  getProfessionalById,
  getServices,
  getUserByUsername,
  updateProfessional,
} from "../utils/http";
import { getAuthToken } from "../utils/auth";

const ProfessionalPage = () => {
  return <CreateHairDresserForm />;
};

export default ProfessionalPage;

const checkAuthAndRedirect = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  const user = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    return redirect("/login");
  }
};

const formatServices = (services) => {
  return services
    ? Object.entries(services).map(([id, service]) => ({
        id,
        services: service,
      }))[0].services
    : null;
};

export const loader = async () => {
  try {
    await checkAuthAndRedirect();

    const services = await getServices();
    return {
      services: formatServices(services),
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
      professional: { ...professional, id: professionalId },
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
  };

  return userData;
};

export const action = async ({ request }) => {
  try {
    const userData = await processFormData(request);
    console.log(userData, "userData");

    const hairDresser = await getHairDresserByPhone(userData.phone);
    if (hairDresser) {
      return { message: "El profesional ya existe" };
    }

    await createHairDresser(userData);

    return { status: 200, message: "Profesional creado correctamente" };
  } catch (error) {
    return error;
  }
};

export const updateAction = async ({ request }) => {
  try {
    const userData = await processFormData(request);
    const id = request.formData().get("id");

    const hairDresser = await getHairDresserByPhone(userData.phone);
    if (hairDresser && hairDresser.id !== id) {
      return { message: "El telefono ya existe" };
    }

    await updateProfessional(userData, id);

    return { status: 200, message: "Profesional actualizado correctamente" };
  } catch (error) {
    return error;
  }
};