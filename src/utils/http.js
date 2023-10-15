const url = `https://peluqueria-8a666-default-rtdb.firebaseio.com/`;
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

export const getUserByUsername = async (userName) => {
  const data = await fetchAndHandleError("user.json");
  return Object.values(data).find((item) => item.userName === userName);
};

export const login = async ({ userName, password }) => {
  const data = await fetchAndHandleError("user.json");
  return Object.values(data).find(
    (item) => item.userName === userName && item.password === password
  );
};

export async function createUser(userData) {
  await fetchAndHandleError("user.json", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
}

export const createHairDresser = async (userData) => {
  await fetchAndHandleError("hairdresser.json", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

export const getHairDresserByPhone = async (phone) => {
  const data = await fetchAndHandleError("hairdresser.json");
  return Object.values(data).find((item) => item.phone === phone);
};

export const getHairDressers = async () => {
  return fetchAndHandleError("hairdresser.json");
};

export const getClientbyPhone = async (phone) => {
  const data = await fetchAndHandleError("clients.json");
  if (!data) return null;
  return Object.values(data).find((item) => item.phone === phone);
};

export const createClient = async (clientData) => {
  await fetchAndHandleError("clients.json", {
    method: "POST",
    body: JSON.stringify(clientData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

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
  await fetchAndHandleError("services.json", {
    method: "POST",
    body: JSON.stringify(services),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

export const getServices = async () => {
  return fetchAndHandleError("services.json");
};

export const createShift = async (shiftData) => {
  await fetchAndHandleError("shifts.json", {
    method: "POST",
    body: JSON.stringify(shiftData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return true;
};

export const getShifts = async () => {
  return fetchAndHandleError("shifts.json");
};

export const getShiftbyId = async (id) => {
  const shifts = await fetchAndHandleError("shifts.json");
  if (!shifts) return null;
  if (id in shifts) {
    return shifts[id];
  }
  return null;
};
