import { RouterProvider, createBrowserRouter } from "react-router-dom";

import CalendarPage, {loader as calendarLoader} from "./pages/Calendar";
import LoginPage, { action as loginAction } from "./pages/Login";
import RootLayout from "./pages/Root";
import { tokenLoader } from "./utils/auth";
import { action as logoutAction } from "./pages/Logout";
import CreateUserPage, { action as createUserAction } from "./pages/CreateUser";
import CreateHairDresserPage, {
  loader as createHairDresserLoader,
  action as createHairDresserAction,
} from "./pages/CreateHairDresser";
import NotFoundPage from "./pages/NotFound";
import ShiftActionsPage, { loader as shiftLoader, action as shiftAction } from "./pages/ShiftActions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        path: '/agenda',
        element: <CalendarPage />,
        loader: calendarLoader,
        id: 'calendar',
        children: [
          {
            path: "/agenda/crear-turno",
            element: <ShiftActionsPage />,
            loader: shiftLoader,
            action: shiftAction,
          },
          {
            path: "/agenda/editar-turno/:shiftId",
            element: <ShiftActionsPage />,
            loader: shiftLoader,
            action: shiftAction,
          },
        ],
      },
      {
        path: "/login",
        element: <LoginPage />,
        action: loginAction,
      },
      {
        path: "/logout",
        action: logoutAction,
      },
      {
        path: "/crear-usuario",
        element: <CreateUserPage />,
        action: createUserAction,
      },
      {
        path: "/crear-peluquero",
        element: <CreateHairDresserPage />,
        loader: createHairDresserLoader,
        action: createHairDresserAction,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
