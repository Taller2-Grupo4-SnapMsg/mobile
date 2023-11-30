import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert }  from 'react-native';


const OK = 200
const USER_NOT_FOUND = 404
const USER_BLOCKED = 403

const RegisterBiometrics = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log("entre a register biometrics");
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        'token': token,
    };
    try {
        const response = await fetch('https://gateway-api-service-merok23.cloud.okteto.net/user/biometric_token/', {
            method: 'POST',
            headers: headers,
        });
        const responseData = await response.json();
        switch (response.status) {
            case OK:
                return responseData.biometric_token;
        
            case USER_NOT_FOUND:
                return false;
            default:
                Alert.alert('Error desconocido');
                return false;
        }
    }
    catch (error) {
        const message =
            error.response?.data?.error ||
            error.message ||
            'Service is not available at the moment';
        throw new Error(message);
    }
}

export default RegisterBiometrics;
