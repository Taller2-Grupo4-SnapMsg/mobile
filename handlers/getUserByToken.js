import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;

const getUserByToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'accept': 'application/json',
                'token': token,
            };
            const response = await fetch('https://gateway-api-service-merok23.cloud.okteto.net/get_user_by_token/', {
                method: 'GET',
                headers: headers,
            });
            if (response.status === OK) {
                const user = await response.json();
                return user;
            } 
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
};

export default getUserByToken;



