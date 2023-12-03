import AsyncStorage from '@react-native-async-storage/async-storage';

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
      if (response.status === 200) {
        return;
      } else if (response.status === 403) {
        return;
      } else if (response.status === 404) {
        return;
      } else if (response.status === 405) {
        return;
      }

      // Handle errors using catch block
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