import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://gateway-api-merok23.cloud.okteto.net';

const getFollowings = async (email) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };

      const response = await fetch(`${API_BASE_URL}/following/${email}`, {
        method: 'GET',
        headers: headers,
      });
      if (response.status === 200) {
        const data = await response.json();
        return data;
      } else if (response.status === 422) {
        const errorData = await response.json();
        console.error('Validation Error:', errorData);
      } else {
        console.error('Error al obtener followings:', response.status);
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

  
  export default getFollowings;

  