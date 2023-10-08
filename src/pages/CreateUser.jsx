import { redirect } from "react-router-dom";
import CreateUserForm from "../components/CreateUserForm";
import { createUser, getUserByUsername } from "../utils/http";

const CreateUserPage = () => {
  return <CreateUserForm />;
};

export default CreateUserPage;

export const action = async ({ request }) => {
  const data = await request.formData();
  const userData = {
    user: data.get("user"),
    password: data.get("password"),
    firstName: data.get("firstName"),
    lastName: data.get("lastName"),
    email: data.get("email"),
    dni: data.get("dni"),
    phone: data.get("phone"),
    birthDate: data.get("birthDate"),
    userType: data.get("userType"),
  };

  try {
    const userExists = await getUserByUsername(userData.user);
    if (userExists) {
      return { message: "El usuario ya existe", type: "userExists" };
    } else {
      await createUser(userData);
    }
  } catch (error) {
    return error;
  }

  return redirect("/login");
};
