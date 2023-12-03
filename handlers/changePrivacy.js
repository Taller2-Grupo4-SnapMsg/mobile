import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;

const API_BASE_URL = 'https://gateway-api-service-merok23.cloud.okteto.net';

const changePrivacy = async (privacy, navigation) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };
      const response = await fetch(`${API_BASE_URL}/users/privacy?is_public=${privacy}`, {
        method: 'PUT',
        headers: headers,
      });

      if (response.status === 200) {
        return;
      } else if (response.status === USER_BLOCKED) {
        Alert.alert('User blocked', 'You have been blocked by an administrator');
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('I am sorry, the session has expired', 'Please sign in again');
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
      console.error(message);
      throw new Error(message);
    } 
  } 
};

  
  export default changePrivacy;

  