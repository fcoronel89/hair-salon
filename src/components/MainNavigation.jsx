import { Form, Link, useRouteLoaderData } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { getIsAdmin } from "../utils/auth";

const getIsLoggedAndNotExpired = (token) => {
  return token && token !== "Expired";
};

const MainNavigation = () => {
  const token = useRouteLoaderData("root");
  const isAdmin = token && getIsAdmin();
  const isLoggedNotExpired = getIsLoggedAndNotExpired(token);
  console.log(token);
  return (
    <div className={classes[isLoggedNotExpired ? "header-container" : ""]}>
      {isLoggedNotExpired && (
        <p>
          Hola <strong>{token}</strong>
        </p>
      )}
      <nav className={classes["main-navigation"]}>
        <ul>
          {!isLoggedNotExpired && <li>
            <Link to="/crear-usuario">Crear Usuario</Link>
          </li>}
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
