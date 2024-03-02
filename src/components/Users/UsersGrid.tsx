import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import User from "../../models/user";
import { Link } from "react-router-dom";
import { userTypeTranslations } from "../../utils/helpers";

interface UserRowProps {
  user: User;
}

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const { _id, firstName, lastName, userType } = user;
  const userTypeText = userTypeTranslations[userType];
  const editLink = `/usuarios/editar/${_id}`;

  return (
    <TableRow key={_id}>
      <TableCell>{firstName}</TableCell>
      <TableCell>{lastName}</TableCell>
      <TableCell>{userTypeText}</TableCell>
      <TableCell align="right">
        <IconButton component={Link} to={editLink} title="Editar">
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const UsersGrid = ({ users }: { users: User[] }) => {
  return (
    <TableContainer component={Paper}>
      {users?.length ? (
        <Table>
          <TableHead>
            <TableRow
              sx={{
                "&:last-child th": { fontSize: "1rem", fontWeight: "bold" },
              }}
            >
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Tipo de Usuario</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: User) => (
              <UserRow key={user._id} user={user} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography
          component="p"
          m={2}
          align="center"
          color="text.secondary"
          fontSize={16}
        >
          No hay resultados
        </Typography>
      )}
    </TableContainer>
  );
};

export default UsersGrid;
