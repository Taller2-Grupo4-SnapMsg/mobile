import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;

const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

const getFollowersByUsername = async (email, navigation) => {
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
        Alert.alert('Error', 'User not found');
      } else if (response.status === USER_BLOCKED) {
        Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else {
        console.error('Error al obtener followers:', response.status);
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
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