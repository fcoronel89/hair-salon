import { redirect } from "react-router-dom";
import { logout, queryClient } from "../utils/http";

const handleLogout = async (): Promise<never | Response> => {
  try {
    const response = await logout();
    if (response.ok) {
      localStorage.clear();
      queryClient.invalidateQueries({ queryKey: ["user"] });
      return redirect("/login");
    }
    throw new Error("redirect to login");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const action = handleLogout;

export const loader = handleLogout;
