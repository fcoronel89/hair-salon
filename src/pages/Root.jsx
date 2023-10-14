import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import { useEffect } from "react";
import { getTokenDuration } from "../utils/auth";

const RootLayout = () => {
  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (token === "Expired") {
      return submit(null, { action: "/logout", method: "post" });
    }

    if (token) {
      const tokenDuration = getTokenDuration();
      const logoutTimer = setTimeout(() => {
        submit(null, { action: "/logout", method: "post" });
      }, tokenDuration);

      return () => clearTimeout(logoutTimer);
    }
  }, [token, submit]);

  return (
    <>
      <MainNavigation />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
