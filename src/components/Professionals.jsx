import { useLoaderData } from "react-router-dom";
import classes from "./Professionals.module.css";

const Professionals = () => {
  const professionals = useLoaderData();

  return (
    <div className={classes.container}>
      <ul className={classes["professionals-list"]}>
        {professionals &&
          professionals.map((professional) => (
            <li key={professional.id}>
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
