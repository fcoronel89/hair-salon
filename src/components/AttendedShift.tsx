import {
  useNavigate,
} from "react-router-dom";
import Modal from "./UI/Modal";
import { updateShift } from "../utils/http";
import { useState } from "react";
import { getCombinedDateTime } from "../utils/helpers";
import User from "../models/user";
import { Service } from "../models/service";
import { Professional } from "../models/professional";
import { Client } from "../models/client";
import { Shift } from "../models/shift";
import { Box, Button, Typography } from "@mui/material";

type AttendedShiftProps = {
  shift: Shift;
  client: Client;
  professionals: Professional[];
  users: User[];
  services: Service[];
}

const AttendedShift = ({shift, client, professionals, users, services} : AttendedShiftProps) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  if (!shift || !client) {
    navigate("../");
  }

  const professional = professionals.find(
    (professional) => professional._id === shift.professionalId
  );
  const creator = users.find((user) => user._id === shift.creatorId)
  const service = services.find((item) => item._id === shift.serviceId);
    
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
      <Box display={"flex"} flexDirection={"column"} gap={2.5}>
      <Typography variant="h4" component="h2" mb={3}>Datos del turno</Typography>
        {error && <p>{error}</p>}
        <Typography>
          <strong>Fecha(Mes/Dia/Año):</strong> {shiftDate} {shift.time}
        </Typography>
        <Typography>
          <strong>Cliente:</strong> {client.firstName} {client.lastName}
        </Typography>
        <Typography>
          <strong>Servicio:</strong> {service?.name}
        </Typography>
        <Typography>
          <strong>Profesional:</strong> {professional?.firstName}{" "}
          {professional?.lastName}
        </Typography>
        <Typography>
          <strong>Vendedor:</strong> {creator?.firstName} {creator?.lastName}
        </Typography>
        <Box mt={3} display={"flex"} justifyContent={"flex-end"}>
          <Button variant="contained" color="secondary" onClick={handleAttended}>
            Asistió
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AttendedShift;
