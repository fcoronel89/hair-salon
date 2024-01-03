import { useNavigate, useRouteError } from "react-router-dom";
import MainNavigation from "../components/MainNavigation/MainNavigation";
import { Box } from "@mui/material";

type Error = {
  message: string;
};

const ErrorPage = () => {
  const error = useRouteError() as Error;
  const navigate = useNavigate();
  if (error?.message === "redirect to login") {
    navigate("/logout");
  }

  return (
    <div className="app">
      <MainNavigation />
      <main className="content">
          <Box display={"flex"} flexDirection={"column"} gap={0.5} alignItems={"center"} height={"100vh"} justifyContent={"center"}>
            <h1>Error ocurred!</h1>
            <p>{error?.message}</p>
          </Box>
      </main>
    </div>
  );
};

export default ErrorPage;
