import { AsyncStorage } from 'react-native';

const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };
  
const RegisterHandler = async (email, password, firstName, lastName, username) => {
    try {
        const requestBody = {
        email: email,
        password: password,
        name: firstName,
        last_name: lastName,
        nickname: nickname,
        };

        const response = await fetch('https://loginback-lg51.onrender.com/register', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (response.status === 201) {
        // Registration successful
        const token = responseData.token
        await AsyncStorage.setItem('token', token);
        console.log('Sign up successful');
        // Redirect or perform any other action you need here
        //window.location.href = '/pin';
        } else {
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
