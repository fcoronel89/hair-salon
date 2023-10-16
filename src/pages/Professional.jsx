import { redirect } from "react-router-dom";
import CreateHairDresserForm from "../components/CreateHairDresserForm";
import {
  createHairDresser,
  getHairDresserByPhone,
  getProfessionalById,
  getServices,
  getUserByUsername,
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

  try {
    const [services, professional] = await Promise.all([
      getServices(),
      getProfessionalById(params && params.professionalId),
    ]);
    if (services) {
      const formattedServices = Object.entries(services).map(
        ([id, service]) => ({ id, services: service })
      );
      console.log("formattedServices", formattedServices[0].services);
      console.log("professional", professional);
      return { services: formattedServices[0].services, professional };
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
      return { message: "Peluquero ya existe" };
    }
    await createHairDresser(userData);
  } catch (error) {
    return error;
  }

  return { status: 200, message: "Peluquero creado correctamente" };
};
