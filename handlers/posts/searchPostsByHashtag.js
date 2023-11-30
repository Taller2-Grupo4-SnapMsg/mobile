import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const OK = 200
const USER_BLOCKED = 403
const USER_NOT_FOUND = 404

const API_BASE_URL = 'https://postsback.onrender.com';

const searchPostsByHashtag = async (hashtags, offset, ammount, navigation) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
        const headers = {
          'Content-Type': 'application/json;charset=utf-8',
          'accept': 'application/json',
          'token': token,
        };

      const response = await fetch(`${API_BASE_URL}/posts/search/hashtags/${hashtags}?offset=${offset}&ammount=${ammount}`, {
        method: 'GET',
        headers: headers
      });
      if (response.status === OK) {
        const data = await response.json();
        return data;
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Error', 'I am sorry, your session has expired, please login again');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else if (response.status === USER_BLOCKED) {
        Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else {
        console.log('Error al obtener posts:', response.status);
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
  
  export default searchPostsByHashtag;