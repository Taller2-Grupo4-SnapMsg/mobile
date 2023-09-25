import { Alert } from 'react-native';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const changeName = async (email, name) => {
  try {
    headers = {
      'Accept': 'application/json',
    };

    const response = await fetch(`${API_BASE_URL}/users/${email}/name?new_name=${name}`, {
      method: 'PUT',
      headers: headers,
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else if (response.status === 422) {
      const errorData = await response.json();
      console.error('Validation Error:', errorData);
    } else if (response.status === USER_NOT_FOUND) {
      Alert.alert('Alert', 'El usuario no se encontro. Verifica el email.');
    } else {
      console.error('Error al actualizar nombre:', response.statusText);
    }
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'El servicio no está disponible en este momento';
    console.error(message);
    throw new Error(message);
  }
};

  
  export default changeName;

  