const url = `https://peluqueria-8a666-default-rtdb.firebaseio.com/user.json`;

export const ifUserExists = async (userName) => {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("No se pudo crear el usuario, intente nuevamente");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = await response.json();
  const element = Object.values(data).find((item) => {
    return item.user === userName;
  });
  console.log(element);
  return element;
};

export async function createUser(userData) {
  const response = await fetch(url, {
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
