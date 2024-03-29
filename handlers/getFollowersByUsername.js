import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;
//ponerlo en un .env como en la clase
const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

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
      } else if (response.status === USER_BLOCKED) {
        return;
      } else if (response.status === USER_NOT_FOUND) {
        return;
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