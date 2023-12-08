import {
  useNavigate,
} from "react-router-dom";
import Modal from "./UI/Modal";
import classes from "./AttendedShift.module.css";
import { updateShift } from "../utils/http";
import { useState } from "react";
import { getCombinedDateTime } from "../utils/helpers";

const AttendedShift = ({shift, client, professionals, users, services}) => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (!shift || !client) {
    navigate("../");
  }

  const professional = professionals.find(
    (professional) => professional._id === shift.professionalId
  );
  const creator = users?.find((user) => user._id === shift.creatorId);
  const service = services?.find((item) => item._id === shift.serviceId);
    
  const shiftDate = getCombinedDateTime(shift.date, shift.time).toLocaleDateString();

  const handleAttended = async () => {
    try {
      await updateShift({ ...shift, attended: true }, shift._id);
      // Redirect to the "agenda" page after the shift has been updated
      navigate("../", { replace: true });
    } catch (error) {
      console.error("Error updating shift:", error);
      setError("Ocurrio un error actualizando el turno, por favor volver a intentarlo.");
    }
  };

  return (
    <Modal onClose={() => navigate("../")}>
      <div className={classes["attendend-container"]}>
        <h2>Datos del turno</h2>
        {error && <p className={classes.error}>{error}</p>}
        <p>
          <strong>Fecha(Mes/Dia/Año):</strong> {shiftDate} {shift.time}
        </p>
        <p>
          <strong>Cliente:</strong> {client.firstName} {client.lastName}
        </p>
        <p>
          <strong>Servicio:</strong> {service?.name}
        </p>
        <p>
          <strong>Profesional:</strong> {professional?.firstName}{" "}
          {professional?.lastName}
        </p>
        <p>
          <strong>Vendedor:</strong> {creator?.firstName} {creator?.lastName}
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
