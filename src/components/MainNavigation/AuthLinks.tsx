import { Token, apiUrl } from "../../utils/helpers";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Form } from "react-router-dom";
import CustomLink from "./CustomLink";

const AuthLinks: React.FC<{
  isLoggedNotExpired: boolean;
  userId: Token;
}> = ({ isLoggedNotExpired, userId }) => {
  return (
    <>
      {!isLoggedNotExpired ? (
        <>
          <CustomLink
            to={`${apiUrl}/auth/google`}
            title="Iniciar Sesion"
            icon={<LoginIcon />}
          />
          <CustomLink
            to="/crear-usuario"
            title="Crear Usuario"
            icon={<PersonAddAltIcon />}
          />
        </>
      ) : (
        <>
          <CustomLink
            to={`/usuarios/editar/${userId}`}
            title="Mi Perfil"
            icon={<PersonOutlinedIcon />}
          />
          <CustomLink
            to="/agenda"
            title="Agenda"
            icon={<CalendarTodayOutlinedIcon />}
          />
          <Form action="/logout" method="POST">
            <li className="ps-menuitem-root">
              <span className="ps-menu-button">
                <button type="submit" className="ps-menu-icon">
                  <LogoutIcon />
                </button>
                <button type="submit" className="ps-menu-label">
                  Salir
                </button>
              </span>
            </li>
          </Form>
        </>
      )}
    </>
  );
};

export default AuthLinks;
