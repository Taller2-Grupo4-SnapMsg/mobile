import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }  from 'react-native';


const OK = 200
const USER_NOT_FOUND = 404

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
      
      if (response.status === OK) {
        const token = responseData.token;
        await AsyncStorage.setItem('token', token);

        Alert.alert('Alert', 'Sign Up successful');

        
        //Redirect or perform any other action you need here
        //window.location.href = '/pin';
      }  if (response.status === USER_NOT_FOUND) {
        Alert.alert('Alert', 'The user was not found. Check email and password.');
      } else {
        // Registration failed
        console.error('Sign in failed:', responseData);
      }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.message ||
        'Service is not available at the moment';
      console.log(message);
      throw new Error(message);
    }
  };
  
  export default LogInHandler;
  