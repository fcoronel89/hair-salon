import { redirect } from "react-router-dom";

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
