import { Form, NavLink, useRouteLoaderData } from "react-router-dom";
import "./MainNavigation.scss";
import { getIsAdmin, getAuthUserId } from "../../utils/auth";

import { Box, IconButton, useTheme, Typography, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../context/theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";

const getIsLoggedAndNotExpired = (token: Token) => {
  return !!token;
};

type Token = string | null;

const MainNavigation: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isCollapsed, setIsCollapsed] = useState(!isNonMobile);

  const token = useRouteLoaderData("root") as Token;
  const isAdmin = token && getIsAdmin();
  const userId = token && getAuthUserId();
  const isLoggedNotExpired = getIsLoggedAndNotExpired(token);
  
  return (
    <Box
      sx={{
        "& .ps-sidebar-container": {
          background: `${colors.primary[400]} !important`,
        },
        "& .ps-menu-button:hover": {
          background: `${colors.primary[500]} !important`,
        },
        "& .ps-menu-button.ps-active:hover": {
          background: `${colors.primary[400]} !important`,
        },
      }}
      className="sidebar"
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
            disabled={!isNonMobile}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Peluqueria
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`https://media.licdn.com/dms/image/D4D03AQGqZ801Cvl5kQ/profile-displayphoto-shrink_100_100/0/1698165312832?e=1709769600&v=beta&t=k--RDNm7Reo87h54uIYlF3sCve3h0Dhu1zyfYAmjGpM`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                {isLoggedNotExpired && (
                  <>
                    <Typography
                      variant="h5"
                      color={colors.grey[100]}
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      {token}
                    </Typography>
                    <Typography variant="h5" color={colors.greenAccent[500]}>
                      Admin
                    </Typography>
                  </>
                )}
                <IconButton onClick={colorMode.toggleColorMode}>
                  {theme.palette.mode === "dark" ? (
                    <DarkModeOutlinedIcon />
                  ) : (
                    <LightModeOutlinedIcon />
                  )}
                </IconButton>
              </Box>
            </Box>
          )}
          <Box>
            <CustomLink
              to="/agenda"
              title="Inicio"
              icon={<HomeOutlinedIcon />}
            />

            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[300]}
                sx={{ m: "15px 0 5px 20px" }}
              >
                Secciones
              </Typography>
            )}
            {!isLoggedNotExpired ? (
              <>
                <CustomLink
                  to="/login"
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
              </>
            )}
            {isAdmin && (
              <>
                <CustomLink
                  to="/usuarios"
                  title="Usuarios"
                  icon={<PeopleOutlineIcon />}
                />
                <CustomLink
                  to="/profesionales"
                  title="Profesionales"
                  icon={<PeopleOutlineIcon />}
                />
                <Form action="/logout" method="POST">
                  <li className="ps-menuitem-root">
                    <span className="ps-menu-button">
                      <button type="submit" className="ps-menu-icon">
                        <LogoutIcon />
                      </button>

                      <button type="submit" className="ps-menu-label">
                        Logout
                      </button>
                    </span>
                  </li>
                </Form>
              </>
            )}
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

const CustomLink = ({
  to,
  title,
  icon,
  ...props
}: {
  to: string;
  title: string;
  icon: SVGRectElement;
}) => {
  return (
    <li className="ps-menuitem-root">
      <NavLink
        to={to}
        {...props}
        className={({ isActive }) =>
          isActive ? "ps-menu-button ps-active" : "ps-menu-button"
        }
        end
      >
        <span className="ps-menu-icon">
          <svg width="24" height="24">
            {icon}
          </svg>{" "}
        </span>
        <span className="ps-menu-label">{title}</span>
      </NavLink>
    </li>
  );
};

export default MainNavigation;
