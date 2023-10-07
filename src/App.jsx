import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import CalendarPage from "./pages/Calendar";
import LoginPage, { action as loginAction } from "./pages/Login";
import RootLayout from "./pages/Root";
import { checkAuthLoader, tokenLoader } from "./utils/auth";
import { action as logoutAction } from "./pages/Logout";
import CreateUserPage, { action as createUserAction } from "./pages/CreateUser";
import CreateHairDresserPage, {loader as createHairDresserLoader} from "./pages/CreateHairDresser";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      { index: true, element: <CalendarPage />, loader: checkAuthLoader },
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
      },
      
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
