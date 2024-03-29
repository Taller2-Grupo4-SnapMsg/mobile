import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;
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
      } else if (response.status === USER_BLOCKED) {
        Alert.alert('User blocked', 'You have been blocked by an administrator');
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Session expired', 'Your session has expired, please log in again');
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
      console.log(message);
      throw new Error(message);
    }
  } 
};
  
  export default searchPostsByHashtag;