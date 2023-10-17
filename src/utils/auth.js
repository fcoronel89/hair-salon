import { redirect } from "react-router-dom";
import { getUserByUsername } from "./http";

export const getTokenDuration = () => {
  const expirationDate = new Date(localStorage.getItem("tokenExpiration"));
  const now = new Date();
  return expirationDate.getTime() - now.getTime();
};

export const getIsAdmin = () => localStorage.getItem("admin");

export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  const tokenDuration = getTokenDuration();
  return token && tokenDuration >= 0 ? token : "Expired";
};

export const tokenLoader = getAuthToken;

export const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/login");
  }

  return null;
};

export async function checkUserAuthentication() {
  const userName = getAuthToken();

  if (!userName || userName === "Expired") {
    return redirect("/login");
  }

  const user = await getUserByUsername(userName);

  if (!user || user.userType !== "admin") {
    return redirect("/login");
  }

  return user;
}