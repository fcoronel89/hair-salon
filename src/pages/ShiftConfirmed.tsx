import React from "react";
import { confirmShift } from "../utils/http";
import classes from "./ShiftConfirmed.module.css";

const ShiftConfirmedPage: React.FC = () => {
  return (
    <div className={classes.container}>
      <h2>El turno ha sido confirmado</h2>
      <p>¡Muchas gracias!</p>
    </div>
  );
};

export default ShiftConfirmedPage;

export const loader = async ({
  params,
  request,
}: {
  params: { shiftId: string };
  request: { url: string | null };
}): Promise<boolean | Error> => {
  const shiftId: string | boolean = params && params.shiftId;
  const currentUrl: string | null = request.url;
  const confirmationType: string | null = currentUrl?.includes("profesional")
    ? "professional"
    : "client";
  console.log(currentUrl, "currentUrl");
  try {
    // Assuming confirmShift is a function that returns a Promise
    await confirmShift(shiftId, confirmationType);
  } catch (error) {
    return error as Error;
  }
  return true;
};
