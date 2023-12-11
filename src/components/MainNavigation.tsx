import { Form, NavLink, useRouteLoaderData } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { getIsAdmin, getAuthUserId } from "../utils/auth";

const getIsLoggedAndNotExpired = (token: Token) => {
  return !!token;
};

type Token = string | null;

const MainNavigation: React.FC = () => {
  const token = useRouteLoaderData("root") as Token;
  const isAdmin = token && getIsAdmin();
  const userId = token && getAuthUserId();
  const isLoggedNotExpired = getIsLoggedAndNotExpired(token);
  console.log("mainnavigation", token);
  return (
    <div className={classes[isLoggedNotExpired ? "header-container" : ""]}>
      {isLoggedNotExpired && (
        <p>
          Hola <strong>{token}</strong>
        </p>
      )}
      <nav className={classes["main-navigation"]}>
        <ul>
          {!isLoggedNotExpired && (
            <CustomLink to="/crear-usuario">Crear Usuario</CustomLink>
          )}
          {isAdmin && (
            <>
              <CustomLink to="/profesionales">Profesionales</CustomLink>
              <CustomLink to="/usuarios">Usuarios</CustomLink>
            </>
          )}
          {isLoggedNotExpired && (
            <>
              <CustomLink to={`/usuarios/editar/${userId}`}>
                Mi perfil
              </CustomLink>
              <CustomLink to="/agenda">Agenda</CustomLink>
              <li>
                {" "}
                <Form action="/logout" method="POST">
                  <button>Logout</button>
                </Form>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

const CustomLink = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <li>
      <NavLink
        to={to}
        {...props}
        className={({ isActive }) => (isActive ? classes.active : "")}
        end
      >
        {children}
      </NavLink>
    </li>
  );
};

export default MainNavigation;
