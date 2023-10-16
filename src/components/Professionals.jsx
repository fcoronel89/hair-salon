import { Link, useLoaderData, useNavigate } from "react-router-dom";
import classes from "./Professionals.module.css";

const Professionals = () => {
  const navigate = useNavigate();
  const professionals = useLoaderData();

  const handleRedirect = (id) => {
    navigate(`/profesionales/editar/${id}`);
  };

  return (
    <div className={classes.container}>
      <Link to="/profesionales/crear">Crear Profesional</Link>
      <ul className={classes["professionals-list"]}>
        {professionals &&
          professionals.map((professional) => (
            <li
              key={professional.id}
              onClick={() => handleRedirect(professional.id)}
            >
              <img src={professional.image} />
              <p>
                {professional.firstName} {professional.lastName}
              </p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Professionals;
