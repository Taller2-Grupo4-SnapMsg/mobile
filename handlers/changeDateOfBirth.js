import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;

const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

const changeDateOfBirth = async (date_of_birth, navigation) => {
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
        Alert.alert('Error', 'Please enter a valid date of birth');
      } else if (response.status === USER_BLOCKED) {
        Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Error', 'I am sorry, your session has expired, please login again');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else  {
        console.error('Error al actualizar date of birth:', response.status);
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