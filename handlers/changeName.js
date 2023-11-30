import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;

const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

const changeName = async (name, navigation) => {
  const token = await AsyncStorage.getItem('token');
  
  try {
    headers = {
      'Content-Type': 'application/json;charset=utf-8',
      'accept': 'application/json',
      'token': token,
    };

    const response = await fetch(`${API_BASE_URL}/users/name?new_name=${name}`, {
      method: 'PUT',
      headers: headers,
    });

    if (response.status === OK) {
      const data = await response.json();
      return data;
    } else if (response.status === 422) {
      Alert.alert('Error', 'Please enter a valid name');
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
      console.error('Error al actualizar name:', response.status);
    }
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'El servicio no está disponible en este momento';
    console.error(message);
    throw new Error(message);
  }
};

  
  export default changeName;

  