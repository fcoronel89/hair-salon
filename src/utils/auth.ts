import { getUserById } from "./http";
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

export function checkUserAuthentication(): boolean {
  const userName: string | null = getAuthToken();

  console.log("username", userName);
  if (!userName || userName === "Expired") {
    return false;
    // Return void, indicating no user authentication.
  }
  return true;
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

export const checkAuthAndRedirect = async () => {
  const isLoggedIn = checkUserAuthentication();
  if (!isLoggedIn) {
    return false;
  }

  const userId: string | null = getAuthUserId();

  const user: User = await getUserById(userId);

  if (!user || user.userType !== "admin") {
    return false;
  }
  return true;
};

export const checkLoggedInAndHasAccess = async (userType) => {
  const isLoggedIn = checkUserAuthentication();
  if (!isLoggedIn) {
    return false;
  }

  const userId: string | null = getAuthUserId();

  const user: User = await getUserById(userId);

  if (!user || (user.userType !== "admin" && user.userType !== userType)) {
    return false;
  }
  return true;
};
