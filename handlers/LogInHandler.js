import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }  from 'react-native';


const OK = 200
const USER_NOT_FOUND = 404
const PASSWORD_DOESNT_MATCH = 401

const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };
    
  const LogInHandler = async (email, password) => {
    try {
      const requestBody = {
        email: email,
        password: password,
      };
  
      const response = await fetch('https://loginback-lg51.onrender.com/login/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
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

        default:z
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
  
  export default LogInHandler;
  