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

export const getAuthUserId = (): string | null => localStorage.getItem("user");

export const getAuthToken = (): string | null => {
  const token: string | null = localStorage.getItem("token");
  const tokenDuration: number = getTokenDuration();
  console.log("tokenauth", token);
  return token && tokenDuration >= 0 ? token : !token ? null : "Expired";
};

export const tokenLoader = getAuthToken;

type AuthenticationResult = User | void; // Define a custom type for the return value.

export async function checkUserAuthentication(): Promise<AuthenticationResult> {
  const userName: string | null = getAuthToken();

  if (!userName || userName === "Expired") {
    redirect("/login");
    return; // Return void, indicating no user authentication.
  }

  /*const user: User = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    redirect("/login");
    return; // Return void, indicating no user authentication.
  }

  return user;*/
}

export const setLocalStorageTokens = (user: User) => {
  localStorage.setItem("token", user.email);
  localStorage.setItem("user", user._id);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 5); // 5 hours of session
  localStorage.setItem("tokenExpiration", expiration.toString());

  if (user.userType === "admin") {
    localStorage.setItem("admin", true.toString());
  } else {
    localStorage.removeItem("admin");
  }
};
