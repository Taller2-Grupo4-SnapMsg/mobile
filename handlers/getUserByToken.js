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
                            
            const response = await fetch('https://loginback-lg51.onrender.com/get_user_by_token/', {
                method: 'GET',
                headers: headers,
              });
            if (response.status === OK) {
                const user = await response.json();
                return user;
            } else {
                throw new Error('Error al obtener los datos del usuario: ' ,response.status);
            }
        } else {
            throw new Error('Token no encontrado en AsyncStorage');
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
};

export default getUserByToken;



