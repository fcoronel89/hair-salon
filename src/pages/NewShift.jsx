import { redirect } from "react-router-dom";
import NewShiftForm from "../components/NewShiftForm";
import { getAuthToken } from "../utils/auth";
import {
  createClient,
  getClientbyPhone,
  getHairDressers,
  getUserByUsername,
} from "../utils/http";

const NewShiftPage = () => {
  return <NewShiftForm />;
};

export default NewShiftPage;

export const loader = async () => {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  let data;

  try {
    const user = await getUserByUsername(userName);

    if (!user || user.userType === "hairsalon") {
      return redirect("/login");
    }
    const hairDressers = await getHairDressers();
    if (hairDressers) {
      data = { hairDressers, user };
    }
    console.log(data);
  } catch (error) {
    return error;
  }

  return data;
};

export const action = async ({ request }) => {
  const data = await request.formData();
  const clientData = {
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    phone: data.get("phone"),
  };

  console.log(clientData, "clientData");

  try {
    const client = await getClientbyPhone(clientData.phone);
    if (!client) {
      await createClient(clientData);
    }
  } catch (error) {
    return error;
  }

  return redirect("../");
};
