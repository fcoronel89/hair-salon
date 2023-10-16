import * as Yup from "yup";

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
export const isImage = (message) => Yup.mixed().required(message);
export const isDNI = (message) =>
  Yup.string().max(8, "DNI invalido").min(7, "DNI invalido").required(message);
