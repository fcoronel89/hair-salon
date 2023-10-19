import {
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import Modal from "./UI/Modal";
import classes from "./AttendedShift.module.css";
import { updateShift } from "../utils/http";

const AttendedShift = () => {
  const navigate = useNavigate();
  const { professionals, users } = useRouteLoaderData("calendar");
  const shift = useLoaderData();
  const professional = professionals[shift.professional];
  const seller = users.find((user) => user.id === shift.shiftCreator);

  const handleAttended = async () => {
    await updateShift({ ...shift, attended: true }, shift.id);
    navigate("../");
  };

  return (
    <Modal onClose={() => navigate("../")}>
      <div className={classes["attendend-container"]}>
        <h2>Datos del turno</h2>
        <p>
          <strong>Fecha:</strong> {shift.shiftDate} {shift.time}
        </p>
        <p>
          <strong>Cliente:</strong> {shift.firstName} {shift.lastName}
        </p>
        <p>
          <strong>Servicio:</strong> {shift.service}
        </p>
        <p>
          <strong>Profesional:</strong> {professional.firstName}{" "}
          {professional.lastName}
        </p>
        <p>
          <strong>Vendedor:</strong> {seller.firstName} {seller.lastName}
        </p>
        <div className={classes.actions}>
          <button type="button" onClick={handleAttended}>
            Asistió
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AttendedShift;
