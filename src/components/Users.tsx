import { Link } from "react-router-dom";
import User from "../models/user";
import React, { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import './Users.scss';

import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";

const getUserTypeText = (userType: string): string => {
  const userTypeMap: Record<string, string> = {
    seller: "Vendedor",
    hairsalon: "Peluqueria",
    admin: "Administrador",
  };

  return userTypeMap[userType] ?? "Unknown"; // Default to "Unknown" for unrecognized types
};

interface UserRowProps {
  user: User;
}

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const { _id, firstName, lastName, userType } = user;
  const userTypeText = getUserTypeText(userType);
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

const Users: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: initialUsers } = useQuery<User[]>({
    queryKey: ["users"],
  }) as { data: User[] };

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleSearch = () => {
    console.log(searchInputRef.current.value);
    const searchText = searchInputRef.current?.value.trim().toLowerCase();

    if (searchText) {
      const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchText);
      });
      if (JSON.stringify(filteredUsers) !== JSON.stringify(users)) {
        setUsers(filteredUsers);
      }
    }
  };

  const handleClearSearch = useCallback(() => {
    setUsers(initialUsers);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, [initialUsers]);

  return (
    <>
      <Typography variant="h3" component="h1" mb={6}>
        Lista de usuarios
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={2}
        mb={5}
        className="search-box"
      >
        <TextField
          inputRef={searchInputRef}
          type="text"
          variant="filled"
          size="small"
          label="Por nombre y apellido"
          sx={{ width: "200px" }}
          
        />
        <Button
          color="secondary"
          size="large"
          variant="contained"
          onClick={handleSearch}
        >
          Buscar usuarios
        </Button>
        <Button
          color="secondary"
          size="large"
          variant="contained"
          onClick={handleClearSearch}
        >
          Limpiar busqueda
        </Button>
      </Box>
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
    </>
  );
};

export default Users;
