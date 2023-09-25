import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }  from 'react-native';

const OK = 201
const USERNAME_TAKEN = 400
const EMAIL_TAKEN = 401

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

        if (response.status === OK) {
            const token = responseData.token;
            await AsyncStorage.setItem('token', token);
            Alert.alert('Alert', 'Sign Up successful');
        } if (response.status === USERNAME_TAKEN) {
            Alert.alert('Alert', 'Username already taken.');
        } if (response.status === EMAIL_TAKEN) {
            Alert.alert('Alert', 'Email already taken.');
        }
        else {
        // Registration failed
            console.error('Registration failed:', responseData);
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

export default RegisterHandler;
