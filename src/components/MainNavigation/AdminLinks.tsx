import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import CustomLink from "./CustomLink";

const AdminLinks = () => {
  return (
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
  );
};

export default AdminLinks;
