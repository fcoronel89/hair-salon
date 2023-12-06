import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RootLayout from "./pages/Root";
import { tokenLoader } from "./utils/auth";
import NotFoundPage from "./pages/NotFound";
import ErrorPage from "./pages/Error";
import React from "react";

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
        children: [
          {
            path: "/agenda/crear-turno",
            async lazy() {
              let { loader, action, ShiftActionsPage } = await import(
                "./pages/ShiftActions"
              );
              return {
                action,
                loader,
                Component: ShiftActionsPage,
              };
            },
          },
          {
            path: "/agenda/editar-turno/:shiftId",
            async lazy() {
              let { loader, updateAction, ShiftActionsPage } = await import(
                "./pages/ShiftActions"
              );
              return {
                action: updateAction,
                loader,
                Component: ShiftActionsPage,
              };
            },
          },
          {
            path: "/agenda/asistio/:shiftId",
            async lazy() {
              let { loader, AttendedShiftPage } = await import(
                "./pages/AttendedShift"
              );
              return {
                loader,
                Component: AttendedShiftPage,
              };
            },
          },
        ],
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
          let { loader, UserActionsPage } = await import("./pages/UserActions");
          return {
            loader,
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
          let { updateLoader, updateAction, ProfessionalPage } = await import(
            "./pages/Professional"
          );
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
        loader,
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
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
}

export default App;
