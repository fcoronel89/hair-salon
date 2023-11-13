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

const postData = async (endpoint, data) => {
  return await fetchAndHandleError(`${endpoint}.json`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
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
  try {
    const response = await fetch(`${apiUrl}/clients?phone=${phone}`, {
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
      throw new Error("failed load Clients");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw error;
  }
};

export const getClientbyId = async (clientId) => {
  try {
    const response = await fetch(`${apiUrl}/client/${clientId}`, {
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
      throw new Error("failed load client");
    }
  } catch (error) {
    // Handle any network or other errors
    console.error("Error:", error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await fetch(`${apiUrl}/client`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
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

/***User***/

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
  try {
    const response = await fetch(`${apiUrl}/shift`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shiftData),
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

export const updateShift = async (shiftData, shiftId) => {
  try {
    const response = await fetch(`${apiUrl}/shift/${shiftId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shiftData),
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

export const updateShiftConfirmation = async (shiftData, shiftId) => {
  try {
    const response = await fetch(`${apiUrl}/shift/confirm-shift/${shiftId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shiftData),
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

export const getShifts = async () => {
  try {
    const response = await fetch(`${apiUrl}/shifts`, {
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
    console.log("Error:", error);
    throw error;
  }
};

export const getShiftbyId = async (shiftId) => {
  try {
    const response = await fetch(`${apiUrl}/shift/${shiftId}`, {
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

export const deleteShift = async (shiftId) => {
  try {
    const response = await fetch(`${apiUrl}/shift/${shiftId}`, {
      method: "DELETE",
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

export const sendMessageToConfirmShift = async (shift, confirmationType) => {
  const professional = await getProfessionalById(shift.professionalId);
  const data = {
    recipientPhoneNumber: professional.phone,
    shift,
    confirmationType,
    professional,
  };
  console.log(data, "data");
  //Call Backend
  const response = await fetch(
    `${apiUrl}/send-whatsapp-message`,
    {
      method: "POST",
      credentials: "include",
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
  let updatedField = {};
  if (confirmationType === "professional") {
    updatedField = { professionalConfirmed: true };
  } else {
    updatedField = { clientConfirmed: true };
  }
  
  await updateShiftConfirmation(updatedField, shiftId);
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
    console.log("Error:", error);
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

export const isLoggedIn = async () => {
  try {
    const response = await fetch(`${apiUrl}/auth/isLoggedIn`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      // Handle errors
      throw new Error("User update failed");
    }
  } catch (error) {
    throw new Error("Logout failed");
  }
};
