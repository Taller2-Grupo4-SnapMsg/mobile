import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200
const USER_NOT_FOUND = 404
const PASSWORD_DOESNT_MATCH = 401
const USER_BLOCKED = 403

const LoginWithBiometrics = async (biometric_token) => {
    const headers = {
        "accept": "application/json",
        "Content-Type": "application/json",
        "biometric-token": biometric_token,
    };
    
    try { 
        const response = await fetch('https://gateway-api-service-merok23.cloud.okteto.net/login_with_biometrics/', {
            method: 'POST',
            headers: headers,
        });
        const responseData = await response.json();
        console.log('responseData: ', response.status);
        switch (response.status) {
            case OK:
                const token = responseData.token;
                await AsyncStorage.setItem('token', token);
                return true;
        
            case USER_NOT_FOUND:
                return false;
        
            case PASSWORD_DOESNT_MATCH:
                return false;

            case USER_BLOCKED:
                Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
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
}

export default LoginWithBiometrics;
