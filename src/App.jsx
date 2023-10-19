import { RouterProvider, createBrowserRouter } from "react-router-dom";

import CalendarPage, { loader as calendarLoader } from "./pages/Calendar";
import LoginPage, { action as loginAction } from "./pages/Login";
import RootLayout from "./pages/Root";
import { tokenLoader } from "./utils/auth";
import { action as logoutAction } from "./pages/Logout";
import CreateUserPage, {
  action as createUserAction,
  loader as editUserLoader,
  updateAction as updateUserAction,
} from "./pages/CreateUser";
import ProfessionalPage, {
  loader as createProfessionalLoader,
  action as createProfessionalAction,
  updateAction,
  updateLoader,
} from "./pages/Professional";
import NotFoundPage from "./pages/NotFound";
import ShiftActionsPage, {
  loader as shiftLoader,
  action as shiftAction,
  updateAction as shiftUpdateAction,
} from "./pages/ShiftActions";
import ProfessionalsPage, {
  loader as professionalsLoader,
} from "./pages/Professionals";
import UsersPage, { loader as usersLoader } from "./pages/Users";
import AttendedShiftPage, {
  loader as attendedShiftLoader,
} from "./pages/AttendedShift";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        path: "/agenda",
        element: <CalendarPage />,
        loader: calendarLoader,
        id: "calendar",
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
            action: shiftUpdateAction,
          },
          {
            path: "/agenda/asistio/:shiftId",
            element: <AttendedShiftPage />,
            loader: attendedShiftLoader,
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
        path: "/usuarios",
        element: <UsersPage />,
        loader: usersLoader,
      },
      {
        path: "/usuarios/editar/:userId",
        element: <CreateUserPage />,
        loader: editUserLoader,
        action: updateUserAction,
      },
      {
        path: "/profesionales/crear",
        element: <ProfessionalPage />,
        loader: createProfessionalLoader,
        action: createProfessionalAction,
      },
      {
        path: "/profesionales",
        element: <ProfessionalsPage />,
        loader: professionalsLoader,
      },
      {
        path: "/profesionales/editar/:professionalId",
        element: <ProfessionalPage />,
        loader: updateLoader,
        action: updateAction,
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
