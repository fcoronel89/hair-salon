import CreateUserForm from "../components/CreateUserForm";
import { checkUserAuthentication, setLocalStorageTokens } from "../utils/auth";
import {
  createUser,
  getUserById,
  getUserByUserNameWithId,
  getUserByUsername,
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
  const user = await checkUserAuthentication();
  if (user) {
    const result = await getUserById(params && params.userId);
    return result && { ...result, id: params.userId };
  }
  return false;
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
    setLocalStorageTokens(response.user);
    return redirect("/agenda");
  } catch (error) {
    return error;
  }
};

export const updateAction = async ({ request, params }) => {
  const userData = await formatDataFromRequest(request);

  try {
    const id = params && params.userId;
    const user = await getUserByUserNameWithId(userData.userName);

    if (user && user.id !== id) {
      return { message: "El usuario ya existe", type: "userExists" };
    }

    await updateUser(userData, id); // Assuming you have an update function
  } catch (error) {
    return error;
  }

  return redirect("/usuarios");
};
