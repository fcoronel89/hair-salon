import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RootLayout from "./pages/Root";
import { tokenLoader } from "./utils/auth";
import NotFoundPage from "./pages/NotFound";
import ErrorPage from "./pages/Error";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./context/theme";
import Loading from "./components/UI/Loading";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/agenda",
        id: "calendar",
        async lazy() {
          let { loader, CalendarPage } = await import("./pages/Calendar");
          return {
            loader,
            Component: CalendarPage,
          };
        },
      },
      {
        path: "/login/:userId?",
        async lazy() {
          let { loader, LoginPage } = await import("./pages/Login");
          return {
            loader,
            Component: LoginPage,
          };
        },
      },
      {
        path: "/logout",
        async lazy() {
          let { loader, action } = await import("./pages/Logout");
          return {
            action,
            loader,
          };
        },
      },
      {
        path: "/crear-usuario/:userId?",
        async lazy() {
          let { loader, action, UserActionsPage } = await import(
            "./pages/UserActions"
          );
          return {
            action,
            loader,
            Component: UserActionsPage,
          };
        },
      },
      {
        path: "/usuarios",
        async lazy() {
          let { loader, UsersPage } = await import("./pages/Users");
          return {
            loader,
            Component: UsersPage,
          };
        },
      },
      {
        path: "/usuarios/editar/:userId",
        async lazy() {
          let { updateLoader, UserActionsPage } = await import(
            "./pages/UserActions"
          );
          return {
            loader: updateLoader,
            Component: UserActionsPage,
          };
        },
      },
      {
        path: "/profesionales/crear",
        async lazy() {
          let { loader, action, ProfessionalPage } = await import(
            "./pages/Professional"
          );
          return {
            action,
            loader,
            Component: ProfessionalPage,
          };
        },
      },
      {
        path: "/profesionales/editar/:professionalId",
        async lazy() {
          let { updateLoader, updateAction, ProfessionalPage }: any =
            await import("./pages/Professional");
          return {
            action: updateAction,
            loader: updateLoader,
            Component: ProfessionalPage,
          };
        },
      },
      {
        path: "/profesionales",
        async lazy() {
          let { loader, ProfessionalsPage } = await import(
            "./pages/Professionals"
          );
          return {
            loader,
            Component: ProfessionalsPage,
          };
        },
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/confirmar-turno-profesional/:shiftId",
    async lazy() {
      let { loader, ShiftConfirmedPage } = await import(
        "./pages/ShiftConfirmed"
      );
      return {
        loader: loader as any,
        Component: ShiftConfirmedPage,
      };
    },
  },
  {
    path: "confirmar-turno-cliente/:shiftId",
    async lazy() {
      let { loader, ShiftConfirmedPage } = await import(
        "./pages/ShiftConfirmed"
      );
      return {
        loader,
        Component: ShiftConfirmedPage,
      };
    },
  },
]);

function App() {
  const { theme, colorMode } = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={<Loading />} />
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
