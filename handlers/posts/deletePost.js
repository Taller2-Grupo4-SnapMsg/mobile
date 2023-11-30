import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const OK = 200;
const USER_NOT_FOUND = 404;
const USER_BLOCKED = 403;
URL_POST_BACK = "https://postsback.onrender.com"

const DeletePost = async (post_id, navigation) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    try {
      headers = {
        'Content-Type': 'application/json;charset=utf-8',
        'accept': 'application/json',
        'token': token,
      };

      const response = await fetch(`${URL_POST_BACK}/posts/${post_id}/`, {
        method: 'DELETE',
        headers: headers,
      });

      console.log(response.status);
      if (response.status === OK) {
        return;
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Error', 'I am sorry, your session has expired, please login again');
      } else if (response.status === USER_BLOCKED) {
        Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else {
        console.error('Error al eliminar post:', response.status);
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

  export default DeletePost;