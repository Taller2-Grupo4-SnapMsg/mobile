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
        switch (response.status) {
            case OK:
                const token = responseData.token;
                await AsyncStorage.setItem('token', token);
                return true;
        
            case USER_NOT_FOUND:
                Alert.alert('Alert', 'To be able to log in with biometrics you must have an account. Please sign up.');
                return false;
        
            case PASSWORD_DOESNT_MATCH:
                return false;
            
            case USER_BLOCKED:
                Alert.alert('User blocked', 'You have been blocked by an administrator');
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
