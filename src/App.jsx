import { RouterProvider, createBrowserRouter } from "react-router-dom";

import CalendarPage from "./pages/Calendar";
import LoginPage, { action as loginAction } from "./pages/Login";
import RootLayout from "./pages/Root";
import { checkAuthLoader, tokenLoader } from "./utils/auth";
import { action as logoutAction } from "./pages/Logout";
import CreateUserPage, { action as createUserAction } from "./pages/CreateUser";
import CreateHairDresserPage, {
  loader as createHairDresserLoader,
  action as createHairDresserAction,
} from "./pages/CreateHairDresser";
import NotFoundPage from "./pages/NotFound";
import NewShiftPage, { loader as newShiftLoader, action as newShiftAction } from "./pages/NewShift";

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
        loader: checkAuthLoader,
        children: [
          {
            path: "/agenda/crear-turno",
            element: <NewShiftPage />,
            loader: newShiftLoader,
            action: newShiftAction,
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
