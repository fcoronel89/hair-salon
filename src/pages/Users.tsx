import React from "react";
import Users from "../components/Users";
import User from "../models/user";
import { checkAuthAndRedirect, checkUserAuthentication } from "../utils/auth";
import { getUsers } from "../utils/http";
import { redirect } from "react-router-dom";

const UsersPage: React.FC = () => {
  return <Users />;
};

export default UsersPage;

export const loader = async (): Promise<User[] | Error | Response> => {
  const isLoggedInAndAdmin = await checkAuthAndRedirect();
  if (!isLoggedInAndAdmin) {
    return redirect("/login");
  }

  try {
    const users: User[] = await getUsers();
    return users;
  } catch (error) {
    return error as Error;
  }
  
};
