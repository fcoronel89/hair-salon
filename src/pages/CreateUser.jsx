import CreateUserForm from "../components/CreateUserForm";
import {
  checkUserAuthentication,
  getAuthToken,
  setLocalStorageTokens,
} from "../utils/auth";
import {
  getUserById,
  updateUser,
} from "../utils/http";
import { redirect } from "react-router-dom";

const CreateUserPage = () => {
  return <CreateUserForm />;
};

export default CreateUserPage;

export const loader = async ({ params }) => {
  const userId = params && params.userId;
  if (!userId) {
    return false;
  }
  try {
    const user = await getUserById(userId);
    return user;
  } catch (error) {
    return error;
  }
};

export const updateLoader = async ({ params }) => {
  await checkUserAuthentication();
  const userId = params && params.userId;

  if (!userId) {
    redirect("/agenda");
  }

  try {
    const user = await getUserById(userId);
    return user;
  } catch (error) {
    return error;
  }
};

const formatDataFromRequest = async (request) => {
  const formData = await request.formData();
  const userData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    dni: formData.get("dni"),
    phone: formData.get("phone"),
    birthDate: formData.get("birthDate"),
    userType: formData.get("userType"),
    active: JSON.parse(formData.get("active")),
    googleId: formData.get("googleId"),
  };
  return { userData, id: formData.get("id") };
};

export const action = async ({ request }) => {
  const { userData, id } = await formatDataFromRequest(request);
  console.log("userData", userData, id);
  try {
    const response = await updateUser(id, userData);
    const token = getAuthToken();
    if (!token) {
      setLocalStorageTokens(response.user);
    }
    return redirect("/agenda");
  } catch (error) {
    return error;
  }
};
