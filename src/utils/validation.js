// Import dependencies
import { string, number, date, mixed } from "yup";

// Define supported image formats and max image size
const supportedImageFormats = new Set(["image/jpeg", "image/png", "image/gif"]);
const maxImageSizeInBytes = 20 * 1024 * 1024;

// Validation functions
export const isRequired = (message) => string().required(message);

export const isNumber = (message) =>
  number()
    .integer("Ingresar solo numeros")
    .moreThan(99999999, "Ingresar numero valido")
    .required(message);

export const isDate = (message) =>
  date()
    .nullable()
    .max(new Date(), message);

export const hasAtLeastOneChecked = (message) =>
  mixed().test("atLeastOneChecked", message, (values) => {
    for (const key in values) {
      if (values[key]) {
        return true;
      }
    }
    return false;
  });

export const isImage = (message) =>
  mixed().test("imageValidation", message, (value) => {
    if (!value) {
      return true;
    }
    return supportedImageFormats.has(value.type) && value.size <= maxImageSizeInBytes;
  });

export const isDNI = (message) =>
  string().max(8, "DNI invalido").min(7, "DNI invalido").required(message);

export const isEmail = (message) =>
  string().email("Ingresa un Email valido").required(message);