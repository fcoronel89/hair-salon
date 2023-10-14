import CreateUserForm from "../components/CreateUserForm";
import { createUser, getUserByUsername } from "../utils/http";
import { redirect } from "react-router-dom";

const CreateUserPage = () => {
  return <CreateUserForm />;
};

export default CreateUserPage;

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
