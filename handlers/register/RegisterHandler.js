import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }  from 'react-native';

const OK = 201
const USER_ALREADY_REGISTERED = 409
const CHECK_USERNAME = "Username"
const CHECK_EMAIL= "Email"


const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };
  
const RegisterHandler = async (email, password, firstName, lastName, username, date_of_birth) => {
    try {

        const dob = date_of_birth.replace(/\//g, ' ');
        const requestBody = {
        email: email,
        password: password,
        name: firstName,
        last_name: lastName,
        username: username,
        date_of_birth: dob,
        };

        const response = await fetch('https://loginback-lg51.onrender.com/register', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        switch (response.status) {
            case OK:
                const token = responseData.token;
                await AsyncStorage.setItem('token', token);
                Alert.alert('Alert', 'Sign Up successful');
                break;
        
            case USER_ALREADY_REGISTERED:
                if (responseData.detail && responseData.detail.includes(CHECK_USERNAME)) {
                    Alert.alert('Alert', 'Username already taken.');
                } else if (responseData.detail && responseData.detail.includes(CHECK_EMAIL))
                    Alert.alert('Alert', 'Email already taken.');
                else {
                    Alert.alert('Alert', 'Unknown error with user data.');
                }
                break;
                
            default:
                Alert.alert('Alert', 'Registration failed: ' + responseData);
                console.error('Registration failed:', responseData);
                break;
        }
    } catch (error) {
        console.log("error!: " +  error);
        const message =
        error.response?.data?.error ||
        error.message ||
        'Service is not available at the moment';
        console.log(message);
        throw new Error(message);
    }
};

export default RegisterHandler;
