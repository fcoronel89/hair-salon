import { object } from "yup";

import { isRequired, isNumber, isDate, isDNI } from "../../utils/validation";
import User from "../../models/user";
import { SubmitTarget } from "react-router-dom/dist/dom";

export const validationSchema = object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  phone: isNumber("Ingresar Telefono"),
  dni: isDNI("Ingresar DNI"),
  birthDate: isDate("La fecha no puede ser en el futuro"),
});

export const getDefaultValues = (user: User, isEditMode: boolean): User =>
  isEditMode
    ? user
    : {
        email: user ? user.email : "",
        firstName: "",
        lastName: "",
        birthDate: "",
        phone: "",
        dni: "",
        userType: "seller",
        active: true,
        googleId: user?.googleId,
        neighbourhood: "",
      };

export const processFormData = (
  values: User,
  isEditMode: boolean,
  user: User
): SubmitTarget => {
  const formData = new FormData();

  // Append each key-value pair from values to formData
  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value as string); // Adjust this line based on your actual data types
  });

  if (isEditMode) {
    formData.append("googleId", user?.googleId);
  } else {
    formData.append("_id", user?._id || "");
  }

  return formData;
};
