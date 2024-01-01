import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import MainNavigation from "../components/MainNavigation/MainNavigation";
import { useEffect } from "react";
import { getTokenDuration } from "../utils/auth";

const RootLayout: React.FC = () => {
  const token = useLoaderData();
  const submit = useSubmit();
  console.log("rootlayout", token);
  useEffect(() => {
    console.log("useEffectRootLayout", token);
    if (!token) {
      return submit(null, { action: "/logout", method: "post" });
    }

    if (token) {
      const tokenDuration: number = getTokenDuration();
      const logoutTimer: NodeJS.Timeout = setTimeout(() => {
        submit(null, { action: "/logout", method: "post" });
      }, tokenDuration);

      return () => clearTimeout(logoutTimer);
    }
  }, [token, submit]);

  return (
    <div className="app">
      <MainNavigation />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
