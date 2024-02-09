import { Form, NavLink, useRouteLoaderData } from "react-router-dom";
import "./MainNavigation.scss";
import { getIsAdmin, getAuthUserId } from "../../utils/auth";

import {
  Box,
  IconButton,
  useTheme,
  Typography,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { ReactElement, useContext } from "react";
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
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo from "../../assets/beawake-logo.png";

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../utils/http";
import User from "../../models/user";

const getIsLoggedAndNotExpired = (token: Token) => {
  return !!token;
};

type UserType = "admin" | "seller" | "hairsalon";

const userTypeTranslations: Record<UserType, string> = {
  admin: "Administrador",
  seller: "Vendedor",
  hairsalon: "Peluqueria",
};

const getUserType = (userType: UserType) => {
  return userTypeTranslations[userType];
};

type Token = string | null;

const MainNavigation: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isCollapsed, setIsCollapsed] = useState(!isNonMobile);

  const userEmail = useRouteLoaderData("root") as Token;
  const isAdmin = userEmail && getIsAdmin();
  const userId = userEmail && getAuthUserId();
  const isLoggedNotExpired = getIsLoggedAndNotExpired(userEmail);

  const { data: user } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId as string),
    enabled: !!userId,
  });

  console.log(user);

  return (
    <Box
      sx={{
        "& .ps-menu-button:hover": {
          background: `#d36a26 !important`,
        },
      }}
      className="sidebar"
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu>
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 30px 0",
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
                <img
                  src={logo}
                  alt="logo"
                  className="logo"
                  style={{ height: "28px" }}
                />
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  style={{ color: "white" }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                {user?.avatar ? (
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={user.avatar}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                ) : (
                  <Avatar sx={{ width: "100px", height: "100px" }}>
                    <AccountCircleIcon
                      sx={{
                        width: "100%",
                        height: "100%",
                        bgcolor: colors.primary[200],
                      }}
                    />
                  </Avatar>
                )}
              </Box>
              <Box textAlign="center">
                {isLoggedNotExpired && (
                  <>
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      sx={{ m: "10px 0 0 0" }}
                    >
                      {userEmail}
                    </Typography>
                    <Typography variant="h5">
                      {getUserType(user?.userType)}
                    </Typography>
                  </>
                )}
                <IconButton
                  onClick={colorMode.toggleColorMode}
                  style={{ color: "white" }}
                >
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
            <CustomLink to="/" title="Inicio" icon={<HomeOutlinedIcon />} />

            {!isCollapsed && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }}>
                Secciones
              </Typography>
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
              </>
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
  icon: ReactElement;
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
