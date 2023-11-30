import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const OK = 200
const USER_BLOCKED = 403
const USER_NOT_FOUND = 404

URL_POST_BACK = "https://postsback.onrender.com"

const DeleteDeviceToken = async () => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };

      const response = await fetch(`${URL_POST_BACK}/notifications/${token}`, {
        method: 'DELETE',
        headers: headers,
      });

      console.log(response.status);
      if (response.status === 200) {
        return;
      } else if (response.status === USER_NOT_FOUND) {
        return; 
      } else if (response.status === USER_BLOCKED) {
        return; 
      } else {
        console.error('Error al eliminar device token:', response.status);
      }
      const errorData = await response.json();
      throw new Error('Server Error: ' + JSON.stringify(errorData));
      
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

  export default DeleteDeviceToken;