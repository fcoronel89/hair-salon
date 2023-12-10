import { getUserById } from "./http";
import User from "../models/user";

const getItem = (key: string): string | null => localStorage.getItem(key);
const setItem = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getTokenDuration = (): number => {
  const expirationDateStr: string | null = getItem("tokenExpiration");
  const expirationDate = expirationDateStr
    ? new Date(expirationDateStr)
    : new Date();
  const now = new Date();
  return expirationDate.getTime() - now.getTime();
};

export const getIsAdmin = (): string | null => getItem("admin");
export const getAuthUserId = (): string | null => getItem("user");

export const getAuthToken = (): string | null => {
  const token = getItem("token");
  const tokenDuration = getTokenDuration();
  return token && tokenDuration >= 0 ? token : null;
};

export const tokenLoader = getAuthToken;

export const setLocalStorageTokens = (user: User) => {
  setItem("token", user.email);
  setItem("user", user._id);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24); // 24 hours of session
  setItem("tokenExpiration", expiration.toString());
  if (user.userType === "admin") {
    setItem("admin", "true");
  } else {
    localStorage.removeItem("admin");
  }
};

export function checkUserAuthentication(): boolean {
  const token = getAuthToken();
  return !!token;
}

export const checkLoggedInAndHasAccess = async (
  userType: string
): Promise<boolean> => {
  const token = getAuthToken();
  const userId = getAuthUserId();

  if (!token || !userId) {
    return false;
  }

  const user: User = await getUserById(userId);
  return user && (user.userType === "admin" || user.userType === userType);
};
