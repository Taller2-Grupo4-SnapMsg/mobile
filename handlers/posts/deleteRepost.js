import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;

URL_POST_BACK = "https://postsback.onrender.com"

const DeleteRepost = async (post_id, navigation) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };

      const response = await fetch(`${URL_POST_BACK}/reposts/${post_id}`, {
        method: 'DELETE',
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
        Alert.alert('Session expired', 'Your session has expired, please sign in again');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
      })
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

export default DeleteRepost;