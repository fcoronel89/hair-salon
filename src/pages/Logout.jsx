import { redirect } from "react-router-dom";

export const action = () => {
  localStorage.clear();
  return redirect("/login");
};
