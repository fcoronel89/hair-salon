import UserForm from "../components/UserForm";
import {
  checkUserAuthentication,
  getAuthToken,
  getAuthUserId,
  getIsAdmin,
  setLocalStorageTokens,
} from "../utils/auth";
import { getUserById, isLoggedIn, updateUser } from "../utils/http";
import { redirect } from "react-router-dom";

const UserActionsPage = () => {
  return <UserForm />;
};

export default UserActionsPage;

export const loader = async ({ params }) => {
  const userId = params && params.userId;
  if (!userId) {
    const isLogged = await isLoggedIn();
    if (isLogged) {
      return redirect("/agenda");
    }
    return false;
  }
  try {
    const user = await getUserById(userId);
    return { user };
  } catch (error) {
    return error;
  }
};

export const updateLoader = async ({ params }) => {
  const isLoggedIn = checkUserAuthentication();
  if (!isLoggedIn) {
    redirect("/login");
  }

  const userId = params && params.userId;
  if (!userId) {
    redirect("/agenda");
  }

  const userLoggedInId = getAuthUserId();

  try {
    const user = await getUserById(userId);
    if (userLoggedInId === user._id) {
      return { user };
    }

    if (!getIsAdmin()) {
      redirect("/agenda");
    }

    return { user, adminEditing: true };
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
