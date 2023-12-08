import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;
const OTHER_USER_BLOCKED = 405;
URL_POST_BACK = "https://postsback.onrender.com"

const RepostPost = async (post_id, navigation) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };
      const response = await fetch(`${URL_POST_BACK}/reposts/${post_id}`, {
        method: 'POST',
        headers: headers,
      });
      if (response.status === 200) {
        return 200;
      } else if (response.status === 422) {
        throw new Error('Validación fallida');
      } else if (response.status === 403) {
        return 403;
      } else if (response.status === 409) {
        return 409;
      } else {
        throw new Error('Error desconocido');
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

  export default RepostPost;