import moment from "moment";
import { apiUrl } from "./helpers";
import { QueryClient } from "@tanstack/react-query";
import { Professional } from "../models/professional";
import { Client } from "../models/client";
import { Shift } from "../models/shift";
import { Service } from "../models/service";
import User from "../models/user";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const apiRequest = async (url: string, method: string, data : {} | null = null) => {
  try {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    if (response.ok) {
      return await response.json();
    }
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      throw new Error("redirect to login");
    }
    const { error } = await response.json();
    throw new Error(error ? error : "Request failed");
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/***Professional***/

export const createProfessional = async (professionalData: Professional) => {
  return await apiRequest(`${apiUrl}/professional`, "POST", professionalData);
};

export const updateProfessional = async (professionalData: Professional, professionalId: string) => {
  return await apiRequest(
    `${apiUrl}/professional/${professionalId}`,
    "PUT",
    professionalData
  );
};

export const getProfessionalById = async (professionalId: string): Promise<Professional> => {
  const data = await apiRequest(
    `${apiUrl}/professional/${professionalId}`,
    "GET"
  );
  return data;
};

export const getProfessionals = async () => {
  return await apiRequest(`${apiUrl}/professionals`, "GET");
};

/***Client***/

export const getClientbyPhone = async (phone: string): Promise<Client> => {
  return await apiRequest(`${apiUrl}/clients?phone=${phone}`, "GET");
};

export const getClientbyId = async (clientId: string) => {
  return await apiRequest(`${apiUrl}/client/${clientId}`, "GET");
};

export const createClient = async (clientData: Client): Promise<Client> => {
  return await apiRequest(`${apiUrl}/client`, "POST", clientData);
};

/***User***/

export const getUsers = async () => {
  return await apiRequest(`${apiUrl}/users`, "GET");
};

/***Services***/

export const getServices = async () => {
  return await apiRequest(`${apiUrl}/services`, "GET");
};

/***Shift***/

export const createShift = async (shiftData: Shift) => {
  return await apiRequest(`${apiUrl}/shift`, "POST", shiftData);
};

export const updateShift = async (shiftData: Shift, shiftId: string) => {
  return await apiRequest(`${apiUrl}/shift/${shiftId}`, "PUT", shiftData);
};

export const updateShiftConfirmation = async (shiftData: {}, shiftId: string): Promise<Shift> => {
  return await apiRequest(
    `${apiUrl}/shift/confirm-shift/${shiftId}`,
    "PUT",
    shiftData
  );
};

export const getShiftByIdConfirmation = async (shiftId: string) => {
  return await apiRequest(`${apiUrl}/shift/confirm-shift/${shiftId}`, "GET");
};

export const getShifts = async () => {
  return await apiRequest(`${apiUrl}/shifts`, "GET");
};

export const getShiftbyId = async (shiftId: string) => {
  return await apiRequest(`${apiUrl}/shift/${shiftId}`, "GET");
};

export const deleteShift = async (shiftId: string) => {
  return await apiRequest(`${apiUrl}/shift/${shiftId}`, "DELETE");
};

export const sendMessageToConfirmShift = async (shift: Shift, confirmationType: ConfirmationType) => {
  const professional: Professional = await getProfessionalById(shift.professionalId);
  const data = {
    recipientPhoneNumber: professional.phone,
    shift,
    confirmationType,
    professional,
  };

  return await apiRequest(`${apiUrl}/send-whatsapp-message`, "POST", data);
};

export type ConfirmationType = "professional" | "client";

export const confirmShift = async (shiftId: string, confirmationType: ConfirmationType) => {
  let updatedField = {};
  try {
    if (confirmationType === "professional") {
      updatedField = { professionalConfirmed: true };
      // const shift = await getShiftByIdConfirmation(shiftId);
      // const shiftDate = new Date(shift.date);
      // const date = moment(shiftDate).format("DD-MM-YYYY");

      // const services: Service[] = await getServices();
      // const service = services.find(
      //   (service) => service._id === shift.serviceId
      // );
      // await sendMessageToConfirmShift(
      //   { ...shift, date, service: service?.name },
      //   "client"
      // );
    } else {
      updatedField = { clientConfirmed: true };
    }

    await updateShiftConfirmation(updatedField, shiftId);
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
};

// Api methods

export const getUserById = async (userId: string) => {
  const data = await apiRequest(`${apiUrl}/user/${userId}`, "GET");

  const birthDate = data.user.birthDate && new Date(data.user.birthDate);
  const user = {
    ...data.user,
    birthDate: birthDate && moment(birthDate).format("YYYY-MM-DD"),
  };

  return user;
};

export const updateUser = async (userId: string, userData: User) => {
  return await apiRequest(`${apiUrl}/user/${userId}`, "PUT", userData);
};

export const logout = async () => {
  return await apiRequest(`${apiUrl}/auth/logout`, "GET");
};

export const isLoggedIn = async () => {
  return await apiRequest(`${apiUrl}/auth/isLoggedIn`, "GET");
};

export const getHairSalonUsers = async () => {
  return await apiRequest(`${apiUrl}/users/filter?userType=hairsalon`, "GET");
}