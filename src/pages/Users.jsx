import Users from "../components/Users";
import { checkUserAuthentication } from "../utils/auth";
import { getUsers } from "../utils/http";

const UsersPage = () => {
  return <Users />
};

export default UsersPage;

export const loader = async () => {
  const user = checkUserAuthentication();
  if (user) {
    try {
      return await getUsers();
    } catch (error) {
      return error;
    }
  }
};
