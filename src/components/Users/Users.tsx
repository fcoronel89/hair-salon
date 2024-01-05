import User from "../../models/user";
import React, { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "./Users.scss";

import { Box, Button, TextField, Typography } from "@mui/material";
import UsersGrid from "./UsersGrid";

const Users: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data: initialUsers } = useQuery<User[]>({
    queryKey: ["users"],
  }) as { data: User[] };

  const [users, setUsers] = useState<User[]>(initialUsers);

  const handleSearch = () => {
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
      <UsersGrid users={users} />
    </>
  );
};

export default Users;
