import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const changeDateOfBirth = async (date_of_birth) => {
  const token = await AsyncStorage.getItem('token');

  if (token) {
    try {
      headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'token': token,
      };

      const response = await fetch(`${API_BASE_URL}/users/date_of_birth?new_date_of_birth=${date_of_birth}`, {
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
        Alert.alert('Alert', 'El usuario no se encontro.');
      } else {
        console.error('Error al actualizar date_of_birth:', response.status);
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

  
  export default changeDateOfBirth;