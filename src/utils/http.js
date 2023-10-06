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
  console.log(data);
  const element = Object.values(data).find(item => {
    console.log(item, 'item');
    console.log(userName, 'username');
    return item.user === userName
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
