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
  await fetchAndHandleError(`${endpoint}.json`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
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

export const getUserByUsername = async (userName) => {
  const data = await fetchJsonData("user");
  return Object.values(data).find((item) => item.userName === userName);
};

export const login = async ({ userName, password }) => {
  const data = await fetchJsonData("user");
  return Object.values(data).find(
    (item) => item.userName === userName && item.password === password
  );
};

export async function createUser(userData) {
  return postData("user", userData);
}

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

export const getClientbyPhone = async (phone) => {
  return findDataByField("clients", "phone", phone);
};

export const createClient = async (clientData) => {
  return postData("clients", clientData);
};

export const getUserById = async (id) => {
  return findDataById("user", id);
};


export const getUsers = async () => {
  const users = await fetchJsonData("user");
  return Object.entries(users).map(([id,user])=>({
    id,
    ...user,
  }))
}

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

export const createShift = async (shiftData) => {
  return postData("shifts", shiftData);
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

export const deleteProfessional = async (id) => {
  const shifts = await getShiftsByProfessional(id);
  if (shifts.length === 0) {
    return fetchAndHandleError(`/hairdresser/${id}.json`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return false;
};
