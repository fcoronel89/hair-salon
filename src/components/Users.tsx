import { Link } from "react-router-dom";
import classes from "./Users.module.css";
import User from "../models/user";
import React, { useCallback, useRef, useState } from "react";

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
    <tr key={_id}>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{userTypeText}</td>
      <td>
        <Link to={editLink}>Editar</Link>
      </td>
    </tr>
  );
};

interface UsersProps {
  users: User[];
}

const Users: React.FC<UsersProps> = (props) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>(props.users);

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
    setUsers(props.users);
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
  }, [props.users]);

  return (
    <div className={classes.container}>
      <div className={classes["search-container"]}>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Por nombre y apellido"
        />
        <button onClick={handleSearch}>Buscar usuarios</button>
        <button onClick={handleClearSearch}>Limpiar busqueda</button>
      </div>
      <div>
        {users?.length ? (
          <table className={classes["users-list"]}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Tipo de Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: User) => (
                <UserRow key={user._id} user={user} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className={classes.empty}>No hay resultados</p>
        )}
      </div>
    </div>
  );
};

export default Users;
