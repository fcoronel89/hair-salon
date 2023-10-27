import React from "react";
import Users from "../components/Users";
import User from "../models/user";
import { checkUserAuthentication } from "../utils/auth";
import { getUsers } from "../utils/http";

const UsersPage: React.FC = () => {
  return <Users />;
};

export default UsersPage;

export const loader = async (): Promise<User[] | Error> => {
  const user: User | void = await checkUserAuthentication();
  if (user) {
    try {
      const users: User[] = await getUsers();
      return users;
    } catch (error) {
      return error as Error;
    }
  }
  return [];
};
