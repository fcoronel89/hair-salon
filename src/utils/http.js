import moment from "moment";
import { apiUrl } from "./helpers";

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

export const getServices = async () => {
  try {
    const response = await fetch(`${apiUrl}/services`, {
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
      throw new Error("failed load services");
    }
  } catch (error) {
    // Handle any network or other errors
    console.log("Error:", error);
    throw error;
  }
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
