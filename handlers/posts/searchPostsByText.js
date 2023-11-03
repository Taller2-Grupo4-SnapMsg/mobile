import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://postsback.onrender.com';

const searchPostsByText = async (text, offset, ammount) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
        const headers = {
          'Content-Type': 'application/json;charset=utf-8',
          'accept': 'application/json',
          'token': token,
        };

      const response = await fetch(`${API_BASE_URL}/posts/search/text/${text}?offset=${offset}&ammount=${ammount}`, {
        method: 'GET',
        headers: headers
      });
      console.log('text', text);
      console.log('response', response.status);
      if (response.status === OK) {
        const data = await response.json();
        console.log('data', data);
        return data;
      } else {
        console.error('Error al buscar posts by hashtags:', response.status);
        return []; 
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'El servicio no está disponible en este momento';
      console.log(message);
      throw new Error(message);
    }
  } 
};
  
  export default searchPostsByText;