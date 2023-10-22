import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

const changeAvatar = async (avatar) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Accept': 'application/json',
        'token': token,
      };
      const encodedAvatar = encodeURIComponent(avatar);
      const response = await fetch(`${API_BASE_URL}/users/avatar?new_avatar=${encodedAvatar}`, {
        method: 'PUT',
        headers: headers,
      });

      if (response.status === OK) {
        const data = await response.json();
        return data;
      } else if (response.status === 422) {
        const errorData = await response.json();
        console.error('Validation Error:', errorData);
      } else {
        console.error('Error al actualizar avatar:', response.status);
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

  
  export default changeAvatar;