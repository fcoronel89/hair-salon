import { redirect } from "react-router-dom";
import CreateHairDresserForm from "../components/CreateHairDresserForm";
import { createHairDresser, getUserByUsername } from "../utils/http";
import { getAuthToken } from "../utils/auth";

const CreateHairDresserPage = () => {
  return <CreateHairDresserForm />;
};

export default CreateHairDresserPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  const user = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    return redirect("/login");
  }

  return true;
};

export const action = async ({ request }) => {
  const data = await request.formData();
  const userData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    phone: data.get("phone"),
    birthDate: data.get("birthDate"),
    serviceType: data.get("serviceType").split(","),
  };
  console.log(userData);

  try {
    await createHairDresser(userData);
  } catch (error) {
    return error;
  }

  return { status: 200, message: "Peluquero creado correctamente" };
};
