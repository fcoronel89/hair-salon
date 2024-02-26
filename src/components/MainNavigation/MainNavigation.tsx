import { useRouteLoaderData } from "react-router-dom";
import "./MainNavigation.scss";
import { getIsAdmin, getAuthUserId } from "../../utils/auth";

import { Box, useTheme, Typography, useMediaQuery } from "@mui/material";
import { tokens } from "../../context/theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../utils/http";
import User from "../../models/user";
import { Token } from "../../utils/helpers";
import UserProfile from "./UserProfile";
import HeaderMenu from "./HeaderMenu";
import AdminLinks from "./AdminLinks";
import AuthLinks from "./AuthLinks";
import CustomLink from "./CustomLink";

const getIsLoggedAndNotExpired = (token: Token) => {
  return !!token;
};

const MainNavigation: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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
              <HeaderMenu
                handleCollapsed={() => setIsCollapsed(!isCollapsed)}
              />
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <UserProfile userEmail={userEmail} user={user} />
            </Box>
          )}
          <Box>
            <CustomLink to="/" title="Inicio" icon={<HomeOutlinedIcon />} />

            {!isCollapsed && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }}>
                Secciones
              </Typography>
            )}
            {isAdmin && <AdminLinks />}
            <AuthLinks
              isLoggedNotExpired={isLoggedNotExpired}
              userId={userId}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default MainNavigation;
