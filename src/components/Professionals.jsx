import { Link, useLoaderData, useNavigate } from "react-router-dom";
import classes from "./Professionals.module.css";

const Professionals = () => {
  const navigate = useNavigate();
  const professionals = useLoaderData();

  const handleRedirect = (id) => {
    navigate(`/profesionales/editar/${id}`);
  };

  const renderProfessionals = () => {
    return (
      <ul className={classes["professionals-list"]}>
        {professionals &&
          professionals.map((professional) => (
            <li
              key={professional._id}
              onClick={() => handleRedirect(professional._id)}
            >
              <img src={professional.image} alt={`${professional.firstName} ${professional.lastName}`} />
              <p>
                {professional.firstName} {professional.lastName}
              </p>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div className={classes.container}>
      <Link to="/profesionales/crear">Crear Profesional</Link>
      {renderProfessionals()}
    </div>
  );
};

export default Professionals;
