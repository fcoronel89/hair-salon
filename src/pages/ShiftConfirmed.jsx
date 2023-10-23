import { confirmShift } from "../utils/http";
import classes from "./ShiftConfirmed.module.css";

const ShiftConfirmedPage = () => {
  return (
    <div className={classes.container}>
      <h2>El turno ha sido confirmado</h2>
      <p>¡Muchas gracias!</p>
    </div>
  );
};

export default ShiftConfirmedPage;

export const loader = async ({ params, request }) => {
  const shiftId = params && params.shiftId;
  const currentUrl = request.url;
  const confirmationType = currentUrl.includes("profesional")
    ? "professional"
    : "client";
  console.log(currentUrl, "currentUrl");
  try {
    await confirmShift(shiftId, confirmationType);
  } catch (error) {
    return error;
  }
  return true;
};
