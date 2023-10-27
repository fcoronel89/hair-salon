import { redirect } from "react-router-dom";
import { getUserByUsername } from "./http";
import User from "../models/user";

export const getTokenDuration = (): number => {
  const expirationDateStr: string | null =
    localStorage.getItem("tokenExpiration");
  const expirationDate: Date = new Date(expirationDateStr || "");
  const now: Date = new Date();
  return expirationDate.getTime() - now.getTime();
};

export const getIsAdmin = (): string | null => localStorage.getItem("admin");

export const getAuthToken = (): string => {
  const token: string | null = localStorage.getItem("token");
  const tokenDuration: number = getTokenDuration();
  return token && tokenDuration >= 0 ? token : "Expired";
};

export const tokenLoader = getAuthToken;

type AuthenticationResult = User | void; // Define a custom type for the return value.

export async function checkUserAuthentication(): Promise<AuthenticationResult> {
  const userName: string = getAuthToken();

  if (!userName || userName === "Expired") {
    redirect("/login");
    return; // Return void, indicating no user authentication.
  }

  const user: User = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    redirect("/login");
    return; // Return void, indicating no user authentication.
  }

  return user;
}
