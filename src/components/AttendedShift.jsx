import {
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import Modal from "./UI/Modal";
import classes from "./AttendedShift.module.css";
import { updateShift } from "../utils/http";
import moment from "moment";

const AttendedShift = () => {
  const navigate = useNavigate();
  const { professionals, users, services } = useRouteLoaderData("calendar");
  const { shift, client } = useLoaderData();
  const professional = professionals.find(
    (professional) => professional._id === shift.professionalId
  );
  const seller = users.find((user) => user._id === shift.creatorId);
  const service = services?.find((item) => item.id === +shift.serviceId);
  let shiftDate = new Date(shift.date);
  shiftDate = moment(shiftDate).format("YYYY-MM-DD");

  const handleAttended = async () => {
    await updateShift({ ...shift, attended: true }, shift._id);
    // Redirect to the "agenda" page after the shift has been updated
    navigate("../", { replace: true });
  };

  return (
    <Modal onClose={() => navigate("../")}>
      <div className={classes["attendend-container"]}>
        <h2>Datos del turno</h2>
        <p>
          <strong>Fecha:</strong> {shiftDate} {shift.time}
        </p>
        <p>
          <strong>Cliente:</strong> {client.firstName} {client.lastName}
        </p>
        <p>
          <strong>Servicio:</strong> {service?.value}
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
