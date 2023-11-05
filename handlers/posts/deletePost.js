import AsyncStorage from '@react-native-async-storage/async-storage';

URL_POST_BACK = "https://postsback.onrender.com"

const DeletePost = async (post_id) => {
  console.log("ENTRO A DELETE POST");
  console.log(post_id);
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
      if (response.status === 200) {
        console.log('Post deleted successfully');
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

  export default DeletePost;