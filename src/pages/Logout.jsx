import { redirect } from "react-router-dom";
import { logout } from "../utils/http";

const handleLogout = async () => {
  try {
    const response = await logout();
    if (response.ok) {
      localStorage.clear();
      return redirect("/login");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const action = handleLogout;

export const loader = handleLogout;
