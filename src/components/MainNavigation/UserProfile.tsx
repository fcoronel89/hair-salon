import { ColorModeContext, tokens } from "../../context/theme";
import User from "../../models/user";
import { Box, IconButton, useTheme, Typography, Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { UserType, userTypeTranslations } from "../../utils/helpers";
import { useContext } from "react";

const getIsLoggedAndNotExpired = (token: Token) => {
  return !!token;
};

type Token = string | null;

const getUserType = (userType: UserType) => {
  return userTypeTranslations[userType];
};

const UserProfile: React.FC<{ userEmail: Token; user: User | undefined }> = ({
  userEmail,
  user,
}) => {
  const colors = tokens(useTheme().palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
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
      <Box textAlign="center">
        {getIsLoggedAndNotExpired(userEmail) && (
          <>
            <Typography variant="h5" fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
              {userEmail}
            </Typography>
            <Typography variant="h5">
              {user ? getUserType(user.userType) : ""}
            </Typography>
          </>
        )}
        <IconButton
          onClick={colorMode.toggleColorMode}
          style={{ color: "white" }}
        >
          {useTheme().palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default UserProfile;
