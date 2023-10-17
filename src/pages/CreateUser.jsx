import CreateUserForm from "../components/CreateUserForm";
import { checkUserAuthentication } from "../utils/auth";
import { createUser, getUserById, getUserByUsername } from "../utils/http";
import { redirect } from "react-router-dom";

const CreateUserPage = () => {
  return <CreateUserForm />;
};

export default CreateUserPage;

export const loader = async ({ params }) => {
  const user = checkUserAuthentication();
  console.log("params", params);
  if (user) {
    return await getUserById(params && params.userId);
  }
  return false;
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userData = {
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
