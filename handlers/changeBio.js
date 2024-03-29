import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;
const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

const changeBio = async (bio) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };

      const response = await fetch(`${API_BASE_URL}/users/bio?new_bio=${bio}`, {
        method: 'PUT',
        headers: headers,
      });

      if (response.status === 200) {
        const data = await response.json();
        return data;
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
      console.error(message);
      throw new Error(message);
    } 
  } 
};

  
  export default changeBio;

  