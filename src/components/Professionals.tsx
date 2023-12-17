import { Link, useNavigate } from "react-router-dom";
import classes from "./Professionals.module.css";
import { Professional } from "../models/professional";
import { useQuery } from "@tanstack/react-query";

const Professionals = (): JSX.Element => {
  const navigate = useNavigate();
  const { data: professionals} = useQuery<Professional[]>({
    queryKey: ["professionals"],
  })

  const handleRedirect = (id: string): void => {
    navigate(`/profesionales/editar/${id}`);
  };

  const renderProfessionals = (): JSX.Element => {
    return (
      <ul className={classes["professionals-list"]}>
        {professionals &&
          professionals.map((professional) => (
            <li
              key={professional._id}
              onClick={() => handleRedirect(professional._id)}
            >
              <img
                src={professional.image}
                alt={`${professional.firstName} ${professional.lastName}`}
              />
              <p>
                {professional.firstName} {professional.lastName}
              </p>
            </li>
          ))}
      </ul>
    );
  };

  return (
    <>
      <Link to="/profesionales/crear">Crear Profesional</Link>
      {renderProfessionals()}
    </>
  );
};

export default Professionals;