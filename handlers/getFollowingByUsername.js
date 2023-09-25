import { Alert } from 'react-native';

const OK = 200;
const USER_NOT_FOUND = 404;

const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const getFollowingByUsername = async (username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/following/${username}/count/`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === OK) {
        const following = await response.json();
        return following;
      } else if (response.status === USER_NOT_FOUND) {
        Alert.alert('Alert', 'El usuario no se encontro. Verifica el email.');
      } else {
        console.error('Error al obtener usuario por email:', response.statusText);
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'El servicio no está disponible en este momento';
      console.log(message);
      throw new Error(message);
    }
  };
  
  export default getFollowingByUsername;