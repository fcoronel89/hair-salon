import { Link, useLoaderData } from "react-router-dom";
import classes from "./Users.module.css";
import User from "../models/user";
import React from "react";

const getUserTypeText = (userType: string): string => {
  const userTypeMap: Record<string, string> = {
    seller: "Vendedor",
    hairsalon: "Peluqueria",
    admin: "Administrador",
  };

  return userTypeMap[userType] || "Unknown"; // Default to "Unknown" for unrecognized types
};

interface UserRowProps {
  user: User;
}

const UserRow: React.FC<UserRowProps> = ({ user }) => (
  <tr key={user._id}>
    <td>{user.firstName}</td>
    <td>{user.lastName}</td>
    <td>{getUserTypeText(user.userType)}</td>
    <td>
      <Link to={`/usuarios/editar/${user._id}`}>Editar</Link>
    </td>
  </tr>
);

const Users: React.FC  = () => {
  const users: User[] | unknown = useLoaderData();

  return (
    <div className={classes.container}>
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
          {users && users.map((user:User) => <UserRow key={user._id} user={user} />)}
        </tbody>
      </table>
      <ul></ul>
    </div>
  );
};

export default Users;
