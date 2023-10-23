import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

//ponerlo en un .env como en la clase
const API_BASE_URL = 'https://postsback.onrender.com';

const getUserSnaps = async (email) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      const headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };
      const response = await fetch(`${API_BASE_URL}/posts/profile/${email}`, {
        method: 'GET',
        headers: headers
      });
      if (response.status === OK) {
        const snaps = await response.json();
        return snaps;
      } else {
        console.error('Error al obtener snaps count:', response.status);
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

export default getUserSnaps;