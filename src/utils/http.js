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

export const login = async({userName, password}) => {
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
    return (item.userName === userName && item.password === password);
  });
  console.log(element);
  return element;
}

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
  const response = await fetch(url+'hairdresser.json', {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("No se pudo crear el peluquero, intente nuevamente");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return true;
};
