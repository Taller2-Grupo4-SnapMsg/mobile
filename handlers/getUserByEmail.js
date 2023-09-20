import { Alert } from 'react-native';

const OK = 200;
const USER_NOT_FOUND = 404;

//ponerlo en un .env como en la clase
const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const headers = {
  'Content-Type': 'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*',
};

const getUserByEmail = async (email) => {
  try {
    console.log(email)
    const response = await fetch(`${API_BASE_URL}/users/${email}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === OK) {
        console.log(response)
      const user = await response.json();
      //console.log(user)
      Alert.alert('User Details', JSON.stringify(user));
      return user;
    } else if (response.status === USER_NOT_FOUND) {
      Alert.alert('Alert', 'El usuario no se encontro. Verifica el email.');
    } else {
      console.error('Error al obtener usuario por email:', response.statusText);
    }
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'El servicio no está disponible en este momento';
    console.log(message);
    throw new Error(message);
  }
};

export default getUserByEmail;