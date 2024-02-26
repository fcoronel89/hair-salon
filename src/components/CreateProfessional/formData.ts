import { Professional } from "../../models/professional";
type ProfessionalCheckboxKeys = "serviceType" | "hairSalons";
import { object } from "yup";

import {
  isRequired,
  isNumber,
  isDate,
  isImage,
  isDNI,
  hasAtLeastOneChecked,
} from "../../utils/validation";

export const getCheckBoxObject = (
  array: any[],
  professional?: Professional,
  key?: ProfessionalCheckboxKeys
) => {
  const outputObject: Record<string, boolean> = {};

  array.forEach((item) => {
    outputObject[item._id] =
      professional && key
        ? professional[key].some((subItem) => subItem === item._id.toString())
        : false;
  });

  return outputObject;
};

export const getSelectedCheckboxes = (itemsSelected: {
  [key: string]: boolean;
}) => Object.keys(itemsSelected).filter((key) => itemsSelected[key]);


export const validationSchema = object({
    firstName: isRequired("Ingresar Nombre"),
    lastName: isRequired("Ingresar Apellido"),
    phone: isNumber("Ingresar Telefono"),
    birthDate: isDate("La fecha no puede ser en el futuro"),
    serviceType: hasAtLeastOneChecked(
      "Seleccionar al menos un tipo de servicio"
    ),
    hairSalons: hasAtLeastOneChecked("Seleccionar al menos una peluqueria"),
    image:
      isRequired("Imagen requerida") ||
      isImage("Ingresar imagen valida"),
    dni: isDNI("Ingresar DNI"),
  });


export const formDefaultValues = {
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    dni: "",
    image: null as File | null,
    active: true,
  };

const handleFormSubmit = async (values, isEditMode, professional, submit) => {
  const selectedCheckboxes = getSelectedCheckboxes(values.serviceType);
  const selectedHairSalons = getSelectedCheckboxes(values.hairSalons);

  let imageUrl = values.image instanceof File
    ? await uploadImage(values.image)
    : professional.image.toString();

  const dataToSend = {
    ...values,
    serviceType: selectedCheckboxes,
    hairSalons: selectedHairSalons,
    image: imageUrl,
    birthDate: `${values.birthDate}T00:00:00.000Z`, // convert to ISO format
  };

  if ("__v" in dataToSend) {
    delete (dataToSend as any).__v;
  }

  submit(dataToSend, {
    action: isEditMode
      ? `/profesionales/editar/${professional._id}`
      : "/profesionales/crear",
    method: isEditMode ? "PUT" : "POST",
    encType: "multipart/form-data",
  });
};