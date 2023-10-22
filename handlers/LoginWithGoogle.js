import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }  from 'react-native';


const OK = 200
const USER_NOT_FOUND = 404
const PASSWORD_DOESNT_MATCH = 401


  const LoginWithGoogle = async (firebase_id_token) => {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'firebase-id-token': firebase_id_token,
    };
    
    try { 
      const response = await fetch('https://gateway-api-service-merok23.cloud.okteto.net/login_with_google/', {
        method: 'POST',
        headers: headers,
      });
      const responseData = await response.json();
      switch (response.status) {
        case OK:
            const token = responseData.token;
            await AsyncStorage.setItem('token', token);
            return true;
    
        case USER_NOT_FOUND:
            return false;

        case PASSWORD_DOESNT_MATCH:
            return false;

        default:
            return false;
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Service is not available at the moment';
      throw new Error(message);
    }
  };
  
  export default LoginWithGoogle;
  