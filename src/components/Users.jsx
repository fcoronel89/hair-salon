import { Link, useLoaderData } from "react-router-dom";
import classes from "./Users.module.css";

const getUserTypeText = (userType) => {
  const userTypeMap = {
    seller: "Vendedor",
    hairsalon: "Peluqueria",
    admin: "Administrador",
  };

  return userTypeMap[userType] || "Unknown"; // Default to "Unknown" for unrecognized types
};

const Users = () => {
  const users = useLoaderData();

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
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{getUserTypeText(user.userType)}</td>
                <td>
                  <Link to={`/usuarios/editar/${user.id}`}>Editar</Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ul></ul>
    </div>
  );
};

export default Users;
