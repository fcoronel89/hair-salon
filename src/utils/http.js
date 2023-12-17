import moment from "moment";
import { apiUrl } from "./helpers";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const apiRequest = async (url, method, data) => {
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
    if (response.status === 400 || response.status === 401 || response.status === 403) {
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

export const createProfessional = async (professionalData) => {
  return await apiRequest(`${apiUrl}/professional`, "POST", professionalData);
};

export const updateProfessional = async (professionalData, professionalId) => {
  return await apiRequest(
    `${apiUrl}/professional/${professionalId}`,
    "PUT",
    professionalData
  );
};

export const getProfessionalById = async (professionalId) => {
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

export const getClientbyPhone = async (phone) => {
  return await apiRequest(`${apiUrl}/clients?phone=${phone}`, "GET");
};

export const getClientbyId = async (clientId) => {
  return await apiRequest(`${apiUrl}/client/${clientId}`, "GET");
};

export const createClient = async (clientData) => {
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

export const createShift = async (shiftData) => {
  return await apiRequest(`${apiUrl}/shift`, "POST", shiftData);
};

export const updateShift = async (shiftData, shiftId) => {
  return await apiRequest(`${apiUrl}/shift/${shiftId}`, "PUT", shiftData);
};

export const updateShiftConfirmation = async (shiftData, shiftId) => {
  return await apiRequest(
    `${apiUrl}/shift/confirm-shift/${shiftId}`,
    "PUT",
    shiftData
  );
};

export const getShiftByIdConfirmation = async (shiftId) => {
  return await apiRequest(`${apiUrl}/shift/confirm-shift/${shiftId}`, "GET");
};

export const getShifts = async () => {
  return await apiRequest(`${apiUrl}/shifts`, "GET");
};

export const getShiftbyId = async (shiftId) => {
  return await apiRequest(`${apiUrl}/shift/${shiftId}`, "GET");
};

export const deleteShift = async (shiftId) => {
  return await apiRequest(`${apiUrl}/shift/${shiftId}`, "DELETE");
};

export const sendMessageToConfirmShift = async (shift, confirmationType) => {
  const professional = await getProfessionalById(shift.professionalId);
  const data = {
    recipientPhoneNumber: professional.phone,
    shift,
    confirmationType,
    professional,
  };
  console.log(data, "data");

  return await apiRequest(`${apiUrl}/send-whatsapp-message`, "POST", data);
};

export const confirmShift = async (shiftId, confirmationType) => {
  let updatedField = {};
  try {
    if (confirmationType === "professional") {
      updatedField = { professionalConfirmed: true };
      const shift = await getShiftByIdConfirmation(shiftId);
      const shiftDate = new Date(shift.date);
      const date = moment(shiftDate).format("DD-MM-YYYY");

      const services = await getServices();
      const service = services.find(
        (service) => service._id === shift.serviceId
      );
      await sendMessageToConfirmShift(
        { ...shift, date, service: service.name },
        "client"
      );
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

export const getUserById = async (userId) => {
  const data = await apiRequest(`${apiUrl}/user/${userId}`, "GET");

  const birthDate = data.user.birthDate && new Date(data.user.birthDate);
  const user = {
    ...data.user,
    birthDate: birthDate && moment(birthDate).format("YYYY-MM-DD"),
  };

  return user;
};

export const updateUser = async (userId, userData) => {
  return await apiRequest(`${apiUrl}/user/${userId}`, "PUT", userData);
};

export const logout = async () => {
  return await apiRequest(`${apiUrl}/auth/logout`, "GET");
};

export const isLoggedIn = async () => {
  return await apiRequest(`${apiUrl}/auth/isLoggedIn`, "GET");
};
