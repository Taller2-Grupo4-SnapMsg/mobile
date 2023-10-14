import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

//ponerlo en un .env como en la clase
const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const getFollowersByUsername = async (email) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };
      const response = await fetch(`${API_BASE_URL}/follow/${email}/count/`, {
        method: 'GET',
        headers: headers
      });
      if (response.status === OK) {
        const followers = await response.json();
        return followers;
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Alert', 'El usuario no se encontro. Verifica el email.');
      } else {
        console.error('Error al obtener followers count:', response.status);
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'El servicio no está disponible en este momento';
      throw new Error(message);
    }
  } 
};

export default getFollowersByUsername;