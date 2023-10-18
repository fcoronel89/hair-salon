import CreateUserForm from "../components/CreateUserForm";
import { checkUserAuthentication } from "../utils/auth";
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
  const user = checkUserAuthentication();
  if (user) {
    const result = await getUserById(params && params.userId);
    return result && { ...result, id: params.userId };
  }
  return false;
};

const formatDataFromRequest = async (request) => {
  const formData = await request.formData();
  return {
    userName: formData.get("userName"),
    password: formData.get("password"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    dni: formData.get("dni"),
    phone: formData.get("phone"),
    birthDate: formData.get("birthDate"),
    userType: formData.get("userType"),
  };
};

export const action = async ({ request }) => {
  const userData = await formatDataFromRequest(request);

  try {
    if (await getUserByUsername(userData.userName)) {
      return { message: "El usuario ya existe", type: "userExists" };
    }

    await createUser(userData);
  } catch (error) {
    return error;
  }

  return redirect("/login");
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
