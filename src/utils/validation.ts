import {
  string,
  number,
  date,
  mixed,
  AnyObject,
} from "yup";
import { getYesterdayDate } from "./helpers";

// Define supported image formats and max image size
const supportedImageFormats = new Set(["image/jpeg", "image/png", "image/gif"]);
const maxImageSizeInBytes = 20 * 1024 * 1024;

export const isRequired = (message: string) => string().required(message);

export const isNumber = (message: string) =>
  number()
    .integer("Ingresar solo numeros")
    .moreThan(99999999, "Ingresar numero valido")
    .required(message);

export const isDate = (message: string) =>
  date().nullable().max(new Date(), message);

export const isFutureDate = (message: string) =>
  date().nullable().min(getYesterdayDate(), message).required("Ingresar Fecha");

type CheckboxObject = {
  [key: string]: boolean;
};
export const hasAtLeastOneChecked = (message: string) =>
  mixed().test(
    "atLeastOneChecked",
    message,
    (values: CheckboxObject | undefined) => {
      if (!values) return false;

      return Object.values(values).some((value) => value === true);
    }
  );

export const isImage = (message: string) =>
  mixed().test("imageValidation", message, (value: AnyObject | undefined) => {
    if (!value || !(value instanceof File)) {
      return true;
    }
    return (
      supportedImageFormats.has(value.type) && value.size <= maxImageSizeInBytes
    );
  });

export const isDNI = (message: string) =>
  string().max(8, "DNI invalido").min(7, "DNI invalido").required(message);

export const isEmail = (message: string) =>
  string().email("Ingresa un Email valido").required(message);

export const isTime = (message: string) =>
  string()
    .test(
      "is-time-valid",
      "Formato hora invalido",
      (value: string | undefined) => {
        if (!value) {
          return true;
        }
        // For example, you can use regular expressions to validate time format
        const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return timeRegex.test(value);
      }
    )
    .required(message);