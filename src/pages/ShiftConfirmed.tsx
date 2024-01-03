import { Box, Typography } from "@mui/material";
import { confirmShift } from "../utils/http";

export const ShiftConfirmedPage: React.FC = () => {
  return (
    <Box display={"flex"} flexDirection={"column"} gap={.5} alignItems={"center"} height={"100vh"} justifyContent={"center"} >
      <Typography variant="h3" component="h2" mb={1}>El turno ha sido confirmado</Typography>
      <Typography variant="body1" component="p">¡Muchas gracias!</Typography>
    </Box>
  );
};

export const loader = async ({
    params,
    request,
  }: {
    params: { shiftId: string };
    request: { url: string };
  })=> {
    const shiftId = params?.shiftId;
    const currentUrl= request.url;
    const confirmationType = currentUrl?.includes("profesional")
      ? "professional"
      : "client";
  
    try {
      // Assuming confirmShift is a function that returns a Promise
      await confirmShift(shiftId, confirmationType);
    } catch (error) {
      console.error("Error confirming shift:", error);
      return error as Error;
    }
    return true;
  };