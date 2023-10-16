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

export const loader = async ({ params }) => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  const user = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    return redirect("/login");
  }

  const professionalId = params && params.professionalId;

  try {
    const [services, professional] = await Promise.all([
      getServices(),
      getProfessionalById(professionalId),
    ]);
    if (services) {
      const formattedServices = Object.entries(services).map(
        ([id, service]) => ({ id, services: service })
      );
      console.log("formattedServices", formattedServices[0].services);
      return {
        services: formattedServices[0].services,
        professional: { ...professional, id: professionalId },
      };
    }
  } catch (error) {
    return error;
  }
};

export const action = async ({ request }) => {
  const data = await request.formData();
  const userData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    phone: data.get("phone"),
    birthDate: data.get("birthDate"),
    serviceType: data.get("serviceType").split(","),
    image: data.get("image"),
  };
  console.log(userData, "userData");

  try {
    const hairDresser = await getHairDresserByPhone(userData.phone);
    if (hairDresser) {
      return { message: "El profesional ya existe" };
    }
    await createHairDresser(userData);
  } catch (error) {
    return error;
  }

  return { status: 200, message: "Profesional creado correctamente" };
};

export const updateAction = async ({ request }) => {
  const data = await request.formData();
  const userData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    phone: data.get("phone"),
    birthDate: data.get("birthDate"),
    serviceType: data.get("serviceType").split(","),
    image: data.get("image"),
    dni: data.get("dni"),
  };
  const id = data.get("id");
  try {
    const hairDresser = await getHairDresserByPhone(userData.phone);
    if (hairDresser && hairDresser.id !== id) {
      return { message: "El telefono ya existe" };
    }
    await updateProfessional(userData, id);
  } catch (error) {
    return error;
  }

  return { status: 200, message: "Profesional actualizado correctamente" };
};
