import moment from "moment";
const baseUrl = "https://peluqueria-8a666-default-rtdb.firebaseio.com/";
import { apiUrl } from "./helpers";

const fetchAndHandleError = async (url, options = {}) => {
  const response = await fetch(baseUrl + url, options);

  if (!response.ok) {
    const error = new Error("Error en la solicitud");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
};

const fetchJsonData = async (endpoint) => {
  return fetchAndHandleError(`${endpoint}.json`);
};

const postData = async (endpoint, data) => {
  return await fetchAndHandleError(`${endpoint}.json`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const putData = async (endpoint, id, data) => {
  await fetchAndHandleError(`${endpoint}/${id}.json`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

const findDataByField = async (endpoint, field, value) => {
  const data = await fetchJsonData(endpoint);
  let result;

  for (const key in data) {
    if (data[key][field] === value) {
      result = data[key];
      result.id = key;
      break;
    }
  }

  return result;
};

const findDataById = async (endpoint, id) => {
  return id && fetchJsonData(`${endpoint}/${id}`);
};

/*Export functions*/

/***Professional***/

export const createProfessional = async (professionalData) => {
  try {
    const response = await fetch(`${apiUrl}/professional`, {
      method: "POST", // or 'PATCH' depending on your API
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(professionalData),
    });

    if (response.ok) {
      // User updated successfully
      const data = await response.json();
      return data;
    } else {
      // Handle errors
      throw new Error("User update failed");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw new Error(error);
  }
};

export const updateProfessional = async (professionalData, professionalId) => {
  try {
    const response = await fetch(`${apiUrl}/professional/${professionalId}`, {
      method: "PUT", // or 'PATCH' depending on your API
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(professionalData),
    });

    if (response.ok) {
      // User updated successfully
      const data = await response.json();
      return data;
    } else {
      // Handle errors
      throw new Error("User update failed");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw new Error(error);
  }
};

export const getProfessionalByPhone = async (phone) => {
  return findDataByField("hairdresser", "phone", phone);
};

export const getProfessionalById = async (professionalId) => {
  try {
    const response = await fetch(`${apiUrl}/professional/${professionalId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const birthDate = data.birthDate && new Date(data.birthDate);
      const professional = {
        ...data,
        birthDate: birthDate && moment(birthDate).format("YYYY-MM-DD"),
      };
      return professional;
    } else {
      // Handle errors
      throw new Error("User update failed");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw error;
  }
};

export const getProfessionals = async () => {
  try {
    const response = await fetch(`${apiUrl}/professionals`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle errors
      throw new Error("failed load Professionals");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw error;
  }
};

/***Client***/

export const getClientbyPhone = async (phone) => {
  return findDataByField("clients", "phone", phone);
};

export const createClient = async (clientData) => {
  return postData("clients", clientData);
};

/***User***/

function findUserByUsername(users, username) {
  for (const userId in users) {
    if (users[userId].userName === username) {
      // Found the user, return the complete object with the key "id."
      return {
        id: userId,
        ...users[userId],
      };
    }
  }

  // User not found
  return null;
}

export const getUserByUsername = async (userName) => {
  const users = await fetchJsonData("user");
  console.log("users", users);
  const foundUser = findUserByUsername(users, userName);
  console.log("founduser", foundUser);
  return foundUser;
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // Handle errors
      throw new Error("failed load Users");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  const shifts = await getShiftsByOwner(id);
  if (shifts.length === 0) {
    return fetchAndHandleError(`/user/${id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    const user = await getUserById(id);
    return updateUser({ ...user, active: false }, id);
  }
};

/***Services***/

export const createServices = async () => {
  const services = [
    {
      id: 1,
      value: "color",
      subServices: [
        {
          id: 1,
          value: "B.LuZ Inoa",
        },
        {
          id: 2,
          value: "B.Luz Wella",
        },
        {
          id: 3,
          value: "Color Inoa",
        },
        {
          id: 4,
          value: "Color Wella",
        },
      ],
    },
    {
      id: 2,
      value: "lavado",
      subServices: [
        {
          id: 1,
          value: "Comun",
        },
        {
          id: 2,
          value: "Kerast",
        },
        {
          id: 3,
          value: "Loreal",
        },
      ],
    },
    {
      id: 3,
      value: "corte",
      subServices: [
        {
          id: 1,
          value: "corte",
        },
        {
          id: 2,
          value: "flequillo",
        },
      ],
    },
    {
      id: 4,
      value: "botox",
      subServices: [
        {
          id: 1,
          value: "botox c",
        },
        {
          id: 2,
          value: "botox m",
        },
        {
          id: 3,
          value: "botox l",
        },
        {
          id: 4,
          value: "botox xl",
        },
      ],
    },
    {
      id: 5,
      value: "brushing",
      subServices: [
        {
          id: 1,
          value: "brush o plcht. c.",
        },
        {
          id: 2,
          value: "brush o plcht. m.",
        },
        {
          id: 3,
          value: "brush o plcht. l.",
        },
        {
          id: 4,
          value: "brush o plcht. xl.",
        },
        {
          id: 5,
          value: "bru con plcht. c.",
        },
        {
          id: 6,
          value: "bru con plcht. m.",
        },
        {
          id: 7,
          value: "bru con plcht. l.",
        },
        {
          id: 8,
          value: "bru con plcht. xl.",
        },
      ],
    },
    {
      id: 6,
      value: "baby",
      subServices: [
        {
          id: 1,
          value: "baby corto",
        },
        {
          id: 2,
          value: "baby medio",
        },
        {
          id: 3,
          value: "baby largo",
        },
        {
          id: 4,
          value: "baby xl",
        },
      ],
    },
    {
      id: 7,
      value: "bala",
      subServices: [
        {
          id: 1,
          value: "bala corto",
        },
        {
          id: 2,
          value: "bala medio",
        },
        {
          id: 3,
          value: "bala largo",
        },
        {
          id: 4,
          value: "bala xl",
        },
      ],
    },
    {
      id: 8,
      value: "ref.c.papel",
      subServices: [
        {
          id: 1,
          value: "ref.c.p. corto",
        },
        {
          id: 2,
          value: "ref.c.p. medio",
        },
        {
          id: 3,
          value: "ref.c.p. largo",
        },
        {
          id: 4,
          value: "ref.c.p. xl",
        },
        {
          id: 5,
          value: "ref. 4 a 6 paq",
        },
        {
          id: 6,
          value: "ref. hasta 14 paq",
        },
      ],
    },
    {
      id: 9,
      value: "iluminacion",
      subServices: [
        {
          id: 1,
          value: "ilu. corto",
        },
        {
          id: 2,
          value: "ilu. medio",
        },
        {
          id: 3,
          value: "ilu. largo",
        },
        {
          id: 4,
          value: "ilu. xl",
        },
      ],
    },
    {
      id: 10,
      value: "half",
      subServices: [
        {
          id: 1,
          value: "half. corto",
        },
        {
          id: 2,
          value: "half. medio",
        },
        {
          id: 3,
          value: "half. largo",
        },
        {
          id: 4,
          value: "half. xl",
        },
      ],
    },
    {
      id: 11,
      value: "mechas count.",
      subServices: [
        {
          id: 1,
          value: "m.c. un lateral",
        },
        {
          id: 2,
          value: "m.c. dos lateral",
        },
        {
          id: 3,
          value: "m.c. cuatro lateral",
        },
      ],
    },
  ];
  return postData("services", services);
};

export const getServices = async () => {
  return fetchAndHandleError("services.json");
};

/***Shift***/

export const createShift = async (shiftData) => {
  console.log("shiftData", shiftData);
  return postData("shifts", shiftData);
};

export const updateShift = async (shiftData, id) => {
  return putData("shifts", id, shiftData);
};

export const getShifts = async () => {
  return fetchAndHandleError("shifts.json");
};

export const getShiftbyId = async (id) => {
  const shifts = await fetchAndHandleError("shifts.json");
  if (!shifts) return null;
  if (id in shifts) {
    return { ...shifts[id], id };
  }
  return null;
};

export const deleteShift = async (id) => {
  return fetchAndHandleError(`/shifts/${id}.json`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getShiftsByProfessional = async (id) => {
  const shifts = await getShifts();
  const filteredRecords = Object.values(shifts).filter(
    (record) => record.professional === id
  );
  return filteredRecords;
};

export const getShiftsByOwner = async (id) => {
  const shifts = await getShifts();
  const filteredRecords = Object.values(shifts).filter(
    (record) => record.shiftCreator === id
  );
  return filteredRecords;
};

export const sendMessageToConfirmShift = async (shift, confirmationType) => {
  const professional = await getProfessionalById(shift.professional);
  const data = {
    recipientPhoneNumber: professional.phone,
    shift,
    confirmationType,
    professional,
  };
  console.log(data, "data");
  //Call Backend
  const response = await fetch(
    "https://hair-salon-backend.vercel.app/send-whatsapp-message",
    {
      method: "post",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = new Error("Error en la solicitud");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
};

export const confirmShift = async (shiftId, confirmationType) => {
  const shift = await getShiftbyId(shiftId);
  const updateFields = {
    professionalConfirmed:
      JSON.parse(shift.professionalConfirmed) ||
      confirmationType === "professional",
    clientConfirmed:
      JSON.parse(shift.clientConfirmed) || confirmationType === "client",
  };
  await updateShift({ ...shift, ...updateFields }, shiftId);
  /*if (confirmationType === "professional") {
    await sendMessageToConfirmShift(shift, "client");
  }*/
  return true;
};

//Api methods

export const getUserById = async (userId) => {
  try {
    const response = await fetch(`${apiUrl}/user/${userId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      // Handle errors, such as when the user is not found
      throw new Error("User not found");
    }

    const data = await response.json();
    const birthDate = data.user.birthDate && new Date(data.user.birthDate);
    const user = {
      ...data.user,
      birthDate: birthDate && moment(birthDate).format("YYYY-MM-DD"),
    };

    // Handle the user data retrieved from the backend
    return user;
  } catch (error) {
    // Handle any other errors that may occur during the request
    console.error("Error:", error);
    throw new Error(error); // Or return an error object
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${apiUrl}/user/${userId}`, {
      method: "PUT", // or 'PATCH' depending on your API
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      // User updated successfully
      const data = await response.json();
      return data;
    } else {
      // Handle errors
      throw new Error("User update failed");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    return error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${apiUrl}/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      // User updated successfully
      return await response.json();
    } else {
      // Handle errors
      throw new Error("User update failed");
    }
  } catch (error) {
    throw new Error("Logout failed");
  }
};
