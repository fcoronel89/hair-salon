import { updateShift } from "../utils/http";
import { useEffect, useRef, useState } from "react";
import { getCombinedDateTime } from "../utils/helpers";
import User from "../models/user";
import { Service } from "../models/service";
import { Professional } from "../models/professional";
import { Client } from "../models/client";
import { Shift } from "../models/shift";
import { Box, Button, TextField, Typography } from "@mui/material";
import InputContainer from "./UI/InputContainer";

type AttendedShiftProps = {
  shift: Shift | null;
  clients: Client[];
  professionals: Professional[];
  users: User[];
  services: Service[];
  onClose: () => void;
};

const AttendedShift = ({
  shift,
  clients,
  professionals,
  users,
  services,
  onClose,
}: AttendedShiftProps) => {
  const [error, setError] = useState<string | null>(null);
  const amountRef = useRef<HTMLInputElement>(null);

  if (!shift) return null;

  useEffect(() => {
    if (amountRef.current) {
      amountRef.current.defaultValue = shift.amountPaid
        ? shift.amountPaid.toString()
        : ""; // Set your initial value here
    }
  }, []);

  const professional = professionals.find(
    (professional) => professional._id === shift.professionalId
  );
  const creator = users.find((user) => user._id === shift.creatorId);
  const service = services.find((item) => item._id === shift.serviceId);
  const client = clients.find((item) => item._id === shift.clientId);

  const shiftDate = getCombinedDateTime(
    new Date(shift.date),
    shift.time
  ).toLocaleDateString();
  const handleAttended = async () => {
    try {
      const amountPaidString = amountRef.current?.value;
      const amountPaid = parseFloat(amountPaidString || "");

      if (isNaN(amountPaid) || amountPaid <= 0) {
        setError("Por favor ingresa un monto válido y mayor que 0.");
      } else {
        setError(null);
        await updateShift({ ...shift, attended: true, amountPaid }, shift._id);
        onClose();
      }
    } catch (error) {
      console.error("Error updating shift:", error);
      setError(
        "Ocurrio un error actualizando el turno, por favor volver a intentarlo."
      );
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={2.5}>
      <Typography variant="h4" component="h2" mb={3}>
        Datos del turno
      </Typography>
      {error && <p style={{ color: "red" }}>{error}</p>}
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

      {!shift.attended ? (
        <>
          <InputContainer cssClasses="invalid">
            <TextField
              fullWidth
              variant="filled"
              label="Monto Pagado *"
              type="text"
              id="amount"
              name="amount"
              inputRef={amountRef}
            />
          </InputContainer>
          <Box mt={3} display={"flex"} justifyContent={"flex-end"}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAttended}
            >
              Asistió
            </Button>
          </Box>
        </>
      ) : (
        <Typography>
          <strong>Monto Pagado:</strong> {shift.amountPaid}
        </Typography>
      )}
    </Box>
  );
};

export default AttendedShift;
