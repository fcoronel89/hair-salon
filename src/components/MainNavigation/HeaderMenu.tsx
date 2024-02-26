import { Box, IconButton } from "@mui/material";
import logo from "../../assets/beawake-logo.png";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

type Props = {
  handleCollapsed: () => void;
};

const HeaderMenu: React.FC<Props> = ({ handleCollapsed }) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      ml="15px"
    >
      <img src={logo} alt="logo" className="logo" style={{ height: "28px" }} />
      <IconButton onClick={handleCollapsed} style={{ color: "white" }}>
        <MenuOutlinedIcon />
      </IconButton>
    </Box>
  );
};

export default HeaderMenu;
