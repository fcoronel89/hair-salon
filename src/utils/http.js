const baseUrl = "https://peluqueria-8a666-default-rtdb.firebaseio.com/";

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

/***Login***/

export const login = async ({ userName, password }) => {
  const data = await fetchJsonData("user");
  return Object.values(data).find(
    (item) => item.userName === userName && item.password === password
  );
};

/***Professional***/

export const createProfessional = async (userData) => {
  return postData("hairdresser", userData);
};

export const updateProfessional = async (userData, id) => {
  return putData("hairdresser", id, userData);
};

export const getProfessionalByPhone = async (phone) => {
  return findDataByField("hairdresser", "phone", phone);
};

export const getProfessionalById = async (id) => {
  return findDataById("hairdresser", id);
};

export const getProfessionals = async () => {
  return fetchAndHandleError("hairdresser.json");
};

export const deleteProfessional = async (id) => {
  const shifts = await getShiftsByProfessional(id);
  if (shifts.length === 0) {
    return fetchAndHandleError(`/hairdresser/${id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    const professional = await getProfessionalById(id);
    return updateProfessional({ ...professional, active: false }, id);
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

export async function createUser(userData) {
  return postData("user", userData);
}

export const getUserByUsername = async (userName) => {
  const data = await fetchJsonData("user");
  return Object.values(data).find((item) => item.userName === userName);
};

export const getUserById = async (id) => {
  return findDataById("user", id);
};

export const getUsers = async () => {
  const users = await fetchJsonData("user");
  return Object.entries(users).map(([id, user]) => ({
    id,
    ...user,
  }));
};

export const getUserByUserNameWithId = async (userName) => {
  return findDataByField("user", "userName", userName);
};

export const updateUser = async (userData, id) => {
  return putData("user", id, userData);
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
      value: "color",
      subServices: [
        {
          value: "color 1",
        },
        {
          value: "color 2",
        },
        {
          value: "color 3",
        },
      ],
    },
    {
      value: "alisado",
      subServices: [
        {
          value: "alisado 1",
        },
        {
          value: "alisado 2",
        },
        {
          value: "alisado 3",
        },
      ],
    },
    {
      value: "depilacion",
      subServices: [
        {
          value: "depilacion 1",
        },
        {
          value: "depilacion 2",
        },
        {
          value: "depilacion 3",
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
  const response = await fetch("https://hair-salon-seven.vercel.app/send-whatsapp-message", {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

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
      Boolean(shift.professionalConfirmed) ||
      confirmationType === "professional",
    clientConfirmed:
      Boolean(shift.clientConfirmed) || confirmationType === "client",
  };
  await updateShift({ ...shift, ...updateFields }, shiftId);
  if (confirmationType === "professional") {
    await sendMessageToConfirmShift(shift, "client");
  }
  return true;
};
