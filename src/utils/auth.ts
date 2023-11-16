import { getUserById } from "./http";
import User from "../models/user";

const getItem = (key: string): string | null => localStorage.getItem(key);
const setItem = (key: string, value: string | null): void => {
  if (value) {
    localStorage.setItem(key, value);
  } else {
    localStorage.removeItem(key);
  }
};

export const getTokenDuration = (): number => {
  const expirationDateStr: string | null = getItem("tokenExpiration");
  const expirationDate: Date = expirationDateStr
    ? new Date(expirationDateStr)
    : new Date();
  const now: Date = new Date();
  return expirationDate.getTime() - now.getTime();
};

export const getIsAdmin = (): string | null => getItem("admin");
export const getAuthUserId = (): string | null => getItem("user");

export const getAuthToken = (): string | null => {
  const token: string | null = getItem("token");
  const tokenDuration: number = getTokenDuration();
  return token && tokenDuration >= 0 ? token : null;
};

export const tokenLoader = getAuthToken;

export const setLocalStorageTokens = (user: User): void => {
  setItem("token", user.email);
  setItem("user", user._id);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 24); // 24 hours of session
  setItem("tokenExpiration", expiration.toString());
  setItem("admin", user.userType === "admin" ? "true" : null);
};

export function checkUserAuthentication(): boolean {
  const token: string | null = getAuthToken();
  return !!token;
}

export const checkLoggedInAndHasAccess = async (
  userType: string
): Promise<boolean> => {
  const token: string | null = getAuthToken();
  if (!token) {
    return false;
  }
  const userId: string | null = getAuthUserId();
  const user: User = await getUserById(userId);
  return user && (user.userType === "admin" || user.userType === userType);
};
