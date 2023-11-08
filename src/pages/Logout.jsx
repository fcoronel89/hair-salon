import { redirect } from "react-router-dom";
import { logout } from "../utils/http";

export const action = async () => {
  try {
    const response = await logout();
    if(response.ok) {
      localStorage.clear();
      return redirect("/login");
    } 
  } catch (error) {
    return error;
  }
};
