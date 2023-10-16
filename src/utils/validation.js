import * as Yup from "yup";

const supportedImageFormats = ["image/jpeg", "image/png", "image/gif"]; // Supported image formats
const maxImageSizeInBytes = 20 * 1024 * 1024; // Maximum image size (20 MB)

export const isRequired = (message) => Yup.string().required(message);
export const isNumber = (message) =>
  Yup.number()
    .integer("Ingresar solo numeros")
    .moreThan(99999999, "Ingresar numero valido")
    .required(message);
export const isDate = (message) =>
  Yup.date().nullable().max(new Date(), message);
export const hasAtLeastOneChecked = (message) =>
  Yup.object().test("atLeastOneChecked", message, (values) =>
    Object.values(values).some(Boolean)
  );
export const isImage = (message) =>
  Yup.mixed()
    .test("fileFormat", "Formato de imagen incorrecto", (value) => {
      if (!value) return true; // Allow empty values (no file selected)

      return supportedImageFormats.includes(value.type);
    })
    .test("fileSize", "Imagen muy grande", (value) => {
      if (!value) return true; // Allow empty values (no file selected)

      return value.size <= maxImageSizeInBytes;
    })
    .required(message);
export const isDNI = (message) =>
  Yup.string().max(8, "DNI invalido").min(7, "DNI invalido").required(message);
export const isEmail = (message) =>
  Yup.string().email("Ingresa un Email valido").required(message);
