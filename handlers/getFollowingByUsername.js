import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const getFollowingByUsername = async (email) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    const headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'accept': 'application/json',
      'token': token,
    };
    try {
      const response = await fetch(`${API_BASE_URL}/following/${email}/count/`, {
        method: 'GET',
        headers: headers
      });
      if (response.status === OK) {
        const following = await response.json();
        return following;
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Alert', 'El usuario no se encontro. Verifica el email.');
      } else {
        console.error('Error al obtener following count:', response.statusText);
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'El servicio no está disponible en este momento';
      console.log(message);
      throw new Error(message);
    }
  } else {
    throw new Error('Token no encontrado en AsyncStorage');
  }
};
  
  export default getFollowingByUsername;