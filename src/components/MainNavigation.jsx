import { Form, Link, useRouteLoaderData } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import { getIsAdmin } from "../utils/auth";

const MainNavigation = () => {
  const token = useRouteLoaderData("root");
  const isAdmin = token && getIsAdmin();
  return (
    <nav className={classes["main-navigation"]}>
      <ul>
        <li>
          <Link to="/crear-usuario">Crear Usuario</Link>
        </li>
        {isAdmin && (
          <li>
            <Link to="/crear-peluquero">Crear Peluquero</Link>
          </li>
        )}
        {token && (
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
  );
};

export default MainNavigation;
