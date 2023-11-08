import { RouterProvider, createBrowserRouter } from "react-router-dom";

import CalendarPage, { loader as calendarLoader } from "./pages/Calendar";
import LoginAdminPage, { action as loginAction } from "./pages/LoginAdmin";
import RootLayout from "./pages/Root";
import { tokenLoader } from "./utils/auth";
import { action as logoutAction } from "./pages/Logout";
import CreateUserPage, {
  action as createUserAction,
  loader as createUserLoader,
  updateLoader as editUserLoader,
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
import ShiftConfirmedPage, {
  loader as shiftConfirmedLoader,
} from "./pages/ShiftConfirmed";
import LoginPage, {loader as loginLoader} from "./pages/Login";

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
        path: "/loginAdmin",
        element: <LoginAdminPage />,
        action: loginAction,
      },
      {
        path: "/login/:userId?",
        element: <LoginPage />,
        loader: loginLoader,
      },
      {
        path: "/logout",
        action: logoutAction,
      },
      {
        path: "/crear-usuario/:userId?",
        element: <CreateUserPage />,
        loader: createUserLoader,
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
  {
    path: "/confirmar-turno-profesional/:shiftId",
    element: <ShiftConfirmedPage />,
    loader: shiftConfirmedLoader,
  },
  {
    path: "/confirmar-turno-cliente/:shiftId",
    element: <ShiftConfirmedPage />,
    loader: shiftConfirmedLoader,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
