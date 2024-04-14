import { object } from "yup";
import {
  isFutureDate,
  isNumber,
  isRequired,
  isTime,
} from "../../utils/validation";
import { Shift } from "../../models/shift";
import { Professional } from "../../models/professional";
import User from "../../models/user";
import { addMinutesToDate, getCombinedDateTime } from "../../utils/helpers";

export const neighbourhoods = [
  {
    id: "devoto",
    name: "Devoto",
  },
  {
    id: "ballester",
    name: "Ballester",
  },
  {
    id: "villaadelina",
    name: "Villa Adelina",
  },
];

export const durationData = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300];

export const validationSchema = object({
  firstName: isRequired("Ingresar Nombre"),
  lastName: isRequired("Ingresar Apellido"),
  phone: isNumber("Ingresar Telefono"),
  date: isFutureDate("La fecha no puede ser en el pasado"),
  time: isTime("Ingrese hora"),
  professionalId: isRequired("Selecciona un profesional"),
});

export const isProfessionalHaveService = (
  services: string[],
  serviceSelected: string
) => {
  return Boolean(services.find((service) => service === serviceSelected));
};

export const isAvailableForHairSalon = (
  hairSalonsByProfessional: string[],
  hairSalonSelected: string
) => {
  return Boolean(
    hairSalonsByProfessional.find(
      (hairSalon) => hairSalon === hairSalonSelected
    )
  );
};

export const getShiftByProfessional = (
  shifts: Shift[],
  professionalId: string
) => {
  return shifts.filter((shift) => shift.professionalId === professionalId);
};

export interface FormatedProfessionals extends Professional {
  isEnabled: boolean;
  shifts: Shift[];
}

export const formatProfessionals = (
  professionals: Professional[],
  serviceSelected: string,
  shifts: Shift[],
  user: User
): FormatedProfessionals[] => {
  let professionalsUpdated = professionals.filter((professional) => professional.active);
  if (user.userType === "recepcionist") {
    professionalsUpdated = professionalsUpdated.filter((professional) =>
      professional.hairSalons.find(
        (hairSalon) => hairSalon === user.hairSalonId
      )
    );
  }
  return professionalsUpdated.map((professional) => {
    const mapProfessional = {
      ...professional,
      isEnabled: isProfessionalHaveService(
        professional.serviceType,
        serviceSelected
      ),
      shifts: getShiftByProfessional(shifts, professional._id),
    };

    return mapProfessional;
  });
};

export const isAvailable = (
  startDate: Date,
  endDate: Date,
  shiftsByProfessional: Shift[]
) => {
  if (!startDate || !endDate) {
    return true;
  }
  const shiftSameTime = shiftsByProfessional.some((shift) => {
    const startShift = getCombinedDateTime(shift.date, shift.time);
    const endShift = addMinutesToDate(startShift, Number(shift.duration));
    return (
      (endDate >= startShift && endDate <= endShift) ||
      (startDate >= startShift && startDate <= endShift)
    );
  });
  return !shiftSameTime;
};

export function canDeleteOrEdit(user: User, shift: Shift) {
  return (
    user.userType === "admin" ||
    ((user.userType === "seller" || user.userType === "recepcionist") &&
      user._id === shift.creatorId)
  );
}
export const defaultClientValue = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};
