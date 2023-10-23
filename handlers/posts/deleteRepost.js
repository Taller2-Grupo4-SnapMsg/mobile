import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;
const USER_NOT_FOUND = 404;

URL_POST_BACK = "https://postsback.onrender.com"

const DeleteRepost = async (post_id) => {
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
      } else if (response.status === 422) {
        console.error('Validation Error:', errorData);
      } else {
        console.error('Error when disliking', response.status);
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