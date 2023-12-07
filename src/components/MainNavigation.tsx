import { Form, Link, useRouteLoaderData } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { getIsAdmin, getAuthUserId } from "../utils/auth";

const getIsLoggedAndNotExpired = (token: string | null) => {
  return !!token;
};

const MainNavigation: React.FC = () => {
  const token: string | null = useRouteLoaderData("root") as string | null;
  const isAdmin = token && getIsAdmin();
  const userId: string | null = token && getAuthUserId();
  const isLoggedNotExpired: boolean = getIsLoggedAndNotExpired(token);
  console.log("mainnavigation",token);
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
            <li>
              <Link to="/crear-usuario">Crear Usuario</Link>
            </li>
          )}
          {isAdmin && (
            <>
              <li>
                <Link to="/profesionales">Profesionales</Link>
              </li>
              <li>
                <Link to="/usuarios">Usuarios</Link>
              </li>
            </>
          )}
          {isLoggedNotExpired && (
            <>
              <li>
                <Link to={`/usuarios/editar/${userId}`}>Editar perfil</Link>
              </li>
              <li>
                <Link to="/agenda">Agenda</Link>
              </li>
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

export default MainNavigation;
