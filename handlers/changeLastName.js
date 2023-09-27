import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const changeLastName = async (last_name) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    try {
      headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'token': token,
      };

      const response = await fetch(`${API_BASE_URL}/users/last_name?new_last_name=${last_name}`, {
        method: 'PUT',
        headers: headers,
      });

      if (response.status === OK) {
        const data = await response.json();
        return data;
      } else if (response.status === 422) {
        const errorData = await response.json();
        console.error('Validation Error:', errorData);
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Alert', 'El usuario no se encontro.');
      } else {
        console.error('Error al actualizar bio:', response.statusText);
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'El servicio no está disponible en este momento';
      console.error(message);
      throw new Error(message);
    }
  } else {
    throw new Error('Token no encontrado en AsyncStorage');
  }
};

  
  export default changeLastName;

  