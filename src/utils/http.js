const url = `https://peluqueria-8a666-default-rtdb.firebaseio.com/`;

export const getUserByUsername = async (userName) => {
  const response = await fetch(url + "user.json");

  if (!response.ok) {
    const error = new Error("No se pudo encontrar el usuario");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  const element = Object.values(data).find((item) => {
    return item.userName === userName;
  });
  console.log(element);
  return element;
};

export const login = async ({ userName, password }) => {
  const response = await fetch(url + "user.json");
  if (!response.ok) {
    const error = new Error("No se pudo encontrar el usuario");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  const element = Object.values(data).find((item) => {
    console.log(item);
    return item.userName === userName && item.password === password;
  });
  console.log(element);
  return element;
};

export async function createUser(userData) {
  const response = await fetch(url + "user.json", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("No se pudo crear el usuario, intente nuevamente");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export const createHairDresser = async (userData) => {
  const response = await fetch(url + "hairdresser.json", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "No se pudo crear el peluquero, intente nuevamente"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
};

export const getHairDresserByPhone = async (phone) => {
  const response = await fetch(url + "hairdresser.json");

  if (!response.ok) {
    const error = new Error("No se pudo encontrar el usuario");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  const hairDresser = Object.values(data).find((item) => {
    return item.phone === phone;
  });
  console.log(hairDresser);
  return hairDresser;
};

export const getHairDressers = async () => {
  const response = await fetch(url + "hairdresser.json");

  if (!response.ok) {
    const error = new Error(
      "No se pudieron cargar los peluqueros, vuelva a intentar"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  return data;
};

export const getClientbyPhone = async (phone) => {
  const response = await fetch(url + "clients.json");

  if (!response.ok) {
    const error = new Error("No se pudo encontrar el cliente");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  if(!data){
    return null;
  }
  const client = Object.values(data).find((item) => {
    return item.phone === phone;
  });
  console.log(client, "client");
  return client;
};

export const createClient = async (clientData) => {
  const response = await fetch(url + "clients.json", {
    method: "POST",
    body: JSON.stringify(clientData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "No se pudo crear el cliente, intente nuevamente"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export const createServices = async() => {
  const services = [
    {
      value: "color",
      subServices: [
        {
          value: 'color 1'
        },
        {
          value: 'color 2'
        },
        {
          value: 'color 3'
        }
      ]
    },
    {
      value: "alisado",
      subServices: [
        {
          value: 'alisado 1'
        },
        {
          value: 'alisado 2'
        },
        {
          value: 'alisado 3'
        }
      ]
    },
    {
      value: "depilacion",
      subServices: [
        {
          value: 'depilacion 1'
        },
        {
          value: 'depilacion 2'
        },
        {
          value: 'depilacion 3'
        }
      ]
    }
  ];
  const response = await fetch(url + "services.json", {
    method: "POST",
    body: JSON.stringify(services),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "No se pudo crear los servicios, intente nuevamente"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}

export const getServices =async () => {
  const response = await fetch(url + "services.json");

  if (!response.ok) {
    const error = new Error(
      "No se pudieron cargar los peluqueros, vuelva a intentar"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  console.log(data,"services");
  return data;
}

export const createShift = async (shiftData) => {
  const response = await fetch(url + "shifts.json", {
    method: "POST",
    body: JSON.stringify(shiftData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "No se pudo crear el turno, intente nuevamente"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
}